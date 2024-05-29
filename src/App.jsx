import React from "react"
import openai from "./api.js"

function App() {
  const [text1, setText1] = React.useState({
    question: "What is your favorite movie and why?",
    userAnswer: "",
    embedding: [],
  })
  const [text2, setText2] = React.useState({
    question: "Are you in the mood for something new or a classic?",
    userAnswer: "",
    embedding: [],
  })
  const [text3, setText3] = React.useState({
    question: "Do you wanna have fun or do you want something serious?",
    userAnswer: "",
    embedding: [],
  })

  const handleChange1 = e => {
    setText1({
      ...text1,
      userAnswer: e.target.value,
    })
  }

  const handleChange2 = e => {
    setText2({
      ...text2,
      userAnswer: e.target.value,
    })
  }

  const handleChange3 = e => {
    setText3({
      ...text3,
      userAnswer: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log("Submitted text 1:", text1)
    console.log("Submitted text 2:", text2)
    console.log("Submitted text 3:", text3)
  }

  async function main(text1, text2, text3) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${text1.embedding} ${text2.embedding} ${text3.embedding}`,
      encoding_format: "float",
    })

    console.log(embedding.data[0])
  }
  main()

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

      <form onSubmit={() => handleSubmit}>
        <div className="questions-container">
          <label htmlFor="textarea1">
            What is your favorite movie and why?
          </label>
          <textarea
            placeholder="The Shawshank Redemption
            Because it taught me to never give up hope no matter how hard life gets"
            id="textarea1"
            value={text1.userAnswer}
            onChange={handleChange1}
            rows="4"
            cols="50"
          />
        </div>

        <div className="questions-container">
          <label htmlFor="textarea2">
            Are you in the mood for something new or a classic?
          </label>
          <textarea
            placeholder="I want to watch movies that were released after 1990"
            id="textarea2"
            value={text2.userAnswer}
            onChange={handleChange2}
            rows="4"
            cols="50"
          />
        </div>

        <div className="questions-container">
          <label htmlFor="textarea3">
            Do you wanna have fun or do you want something serious?
          </label>
          <textarea
            placeholder="I want to watch something stupid and fun"
            id="textarea3"
            value={text3.userAnswer}
            onChange={handleChange3}
            rows="4"
            cols="50"
          />
        </div>

        <div className="questions-container">
          <button className="submit-btn" type="submit">
            Let’s Go
          </button>
        </div>
      </form>
    </>
  )
}

export default App
