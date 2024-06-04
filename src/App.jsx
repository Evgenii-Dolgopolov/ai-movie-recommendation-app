import React from "react"
import { openai, supabase } from "./api.js"
import movies from "./movies.js"

function App() {
  const [userInputs, setUserInputs] = React.useState({
    favoriteMovie: "",
    movieRecency: "",
    genre: "",
  })

  const [hasRecommendation, setHasRecommendation] = React.useState(false)
  const [output, setOutput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = (id, value) => {
    setUserInputs(prevInputs => ({
      ...prevInputs,
      [id]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)  
    await main(movies)
    setIsLoading(false)
  }

  async function main(movieData) {
    const movieVectors = await createVector(movieData)
    await addVectorToDb(movieVectors)
    const formattedInput = formatUserInput(userInputs)
    const embedding = await createEmbedding(formattedInput)
    const match = await findMatch(embedding)
    const output = await getChatCompletion(match, formattedInput)
    setOutput(output)
    setHasRecommendation(true)
  }

  async function createVector(data) {
    try {
      const dataEmbedding = await Promise.all(
        data.map(async item => {
          const content = `${item.title}, ${item.releaseYear}, ${item.content}`
          const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: content,
            encoding_format: "float",
          })
          return {
            content: content,
            embedding: response.data[0].embedding,
          }
        })
      )
      return dataEmbedding
    } catch (error) {
      console.error("Error fetching embeddings:", error)
      return []
    }
  }

  async function addVectorToDb(movieVectors) {
    try {
      // Fetch existing records from the database
      const { data: existingRecords, error: fetchError } = await supabase
        .from("documents")
        .select("content")
      if (fetchError) throw fetchError

      // Get the content of existing records for comparison
      const existingContents = existingRecords.map(record => record.content)

      // Filter out movie vectors that already exist in the database
      const newMovieVectors = movieVectors.filter(
        movieVector => !existingContents.includes(movieVector.content)
      )

      // Insert only new records into the database
      if (newMovieVectors.length > 0) {
        const { error: insertError } = await supabase
          .from("documents")
          .insert(newMovieVectors)
        if (insertError) throw insertError
        console.log("Data inserted to DB successfully")
      } else {
        console.log("No new data to insert")
      }
    } catch (error) {
      console.error("Error inserting data to DB:", error)
    }
  }

  function formatUserInput(userAnswerInputs) {
    return `Favorite movie: ${userAnswerInputs.favoriteMovie}. Recency of release: ${userAnswerInputs.movieRecency}. Genre or mood: ${userAnswerInputs.genre}`
  }

  async function createEmbedding(userInput) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userInput,
    })
    return embeddingResponse.data[0].embedding
  }

  // Query Supabase for nearest vector match
  async function findMatch(embedding) {
    const { data } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    })
    return data[0].content
  }

  // Use OpenAI to make the response conversational
  const chatMessages = [
    {
      role: "system",
      content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - a movie list containing movies to give recommendations out of and my preference for a movie containing: favorite movie, how much of a classic or a recently released a movie is and what a movie genre. Your main job is to provide me a movie recommendation using the provided context. If there is no good match from the provided movie list, then come up with a recommendation on your own. Don't include the input given to you in your response and don't refer to the list of movies provided. Omit periods and commas inside the quotation marks when providing movie titles, but make sure that all the other punctuation in your response is grammatically correct.`,
    },
  ]

  async function getChatCompletion(moviesList, userPreference) {
    chatMessages.push({
      role: "user",
      content: `Movie list: ${moviesList} User preference: ${userPreference}`,
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: chatMessages,
      temperature: 0.5,
      frequency_penalty: 0.5,
    })

    return response.choices[0].message.content
  }

  return (
    <>
      <header>
        <img
          className="header-logo"
          src="src/assets/logo.png"
          alt="movie app logo"
        />
        <h1 className="header-title">PopChoice</h1>
      </header>
      {!hasRecommendation ? (
        <form onSubmit={handleSubmit}>
          <div className="questions-container">
            <label htmlFor="favoriteMovie">
              What is your favorite movie and why?
            </label>
            <textarea
              placeholder="The Shawshank Redemption. Because it taught me to never give up hope no matter how hard life gets"
              id="favoriteMovie"
              value={userInputs.favoriteMovie}
              onChange={e => handleChange("favoriteMovie", e.target.value)}
              rows="4"
              cols="50"
            />
          </div>

          <div className="questions-container">
            <label htmlFor="movieRecency">
              Are you in the mood for something new or a classic?
            </label>
            <textarea
              placeholder="Are you in the mood for something new or a classic?"
              id="movieRecency"
              value={userInputs.movieRecency}
              onChange={e => handleChange("movieRecency", e.target.value)}
              rows="4"
              cols="50"
            />
          </div>

          <div className="questions-container">
            <label htmlFor="genre">
              Do you wanna have fun or do you want something serious?
            </label>
            <textarea
              placeholder="Do you wanna have fun or do you want something serious?"
              id="genre"
              value={userInputs.genre}
              onChange={e => handleChange("genre", e.target.value)}
              rows="4"
              cols="50"
            />
          </div>

          <div className="questions-container">
            <button className="submit-btn" type="submit">
              Let's Go
            </button>
          </div>
        </form>
      ) : (
        <div className="questions-container">
          <h4>{output}</h4>
        </div>
      )}
      {isLoading && <div className="loader">Loading...</div>} {/* Loader */}
    </>
  )
}

export default App
