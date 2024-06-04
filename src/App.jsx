import React from "react"
import { openai, supabase } from "./api.js"
import movies from "./movies.js"

function App() {
  const [userInputs, setUserInputs] = React.useState({
    favoriteMovie: "",
    movieRecency: "",
    genre: "",
  })

  const handleChange = (id, value) => {
    setUserInputs(prevInputs => ({
      ...prevInputs,
      [id]: value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    main(movies)
  }

  async function main(movieData) {
    const movieVectors = await createVector(movieData)
    // const postToDb = await addVectorToDb(movieVectors)
    await addVectorToDb(movieVectors)
    const formattedInput = formatUserInput(userInputs)
    const match = await findNearestMatch(formattedInput)
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

  async function findNearestMatch(userInput) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userInput,
    })
    const embedding = embeddingResponse.data[0].embedding

    // Query Supabase for nearest vector match
    const { data } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.6,
      match_count: 1,
    })
    return data[0].content
  }

  // // Use OpenAI to make the response conversational
  // const chatMessages = [
  //   {
  //     role: "system",
  //     content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - a movie list containing movies to give recommendations out of and a user preference for a movie containing user’s: favorite movie, how much of a classic or a recently released a desired movie is and what a movie genre. Your main job is to provide a movie recommendation using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't have a recommendation." Please do not make up the answer.`,
  //   },
  // ]

  // async function getChatCompletion(movies, embedding) {
  //   chatMessages.push({
  //     role: "user",
  //     content: `Movie list: ${movies} Question: ${embedding}`,
  //   })

  //   const response = await openai.chat.completions.create({
  //     model: "gpt-4-turbo",
  //     messages: chatMessages,
  //     temperature: 0.5,
  //     frequency_penalty: 0.5,
  //   })

  //   console.log(response.choices[0].message.content)
  // }

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
    </>
  )
}

export default App
