import React from "react"
import openai from "./api.js"

function App() {
  const [questions, setQuestions] = React.useState([
    {
      id: 1,
      placeholder: "The Shawshank Redemption. Because it taught me to never give up hope no matter how hard life gets",
      question: "What is your favorite movie and why?",
      userAnswer: "",
      embedding: [],
    },
    {
      id: 2,
      placeholder: "Are you in the mood for something new or a classic?",
      question: "Are you in the mood for something new or a classic?",
      userAnswer: "",
      embedding: [],
    },
    {
      id: 3,
      placeholder: "Do you wanna have fun or do you want something serious?",
      question: "Do you wanna have fun or do you want something serious?",
      userAnswer: "",
      embedding: [],
    },
  ])

  const handleChange = (id, value) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === id ? { ...question, userAnswer: value } : question
      )
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log("Submitted questions:", questions)
    main(questions)
  }

  async function main(questions) {
    const embeddings = await Promise.all(
      questions.map(async question => {
        const response = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: question.userAnswer,
          encoding_format: "float",
        })
        return response.data[0]
      })
    )
    console.log(embeddings)
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

      <form onSubmit={() => handleSubmit}>
        {questions.map(question => (
          <div className="questions-container" key={question.id}>
            <label htmlFor={`textarea${question.id}`}>
              {question.question}
            </label>
            <textarea
              placeholder={question.placeholder}
              id={`textarea${question.id}`}
              value={question.userAnswer}
              onChange={e => handleChange(question.id, e.target.value)}
              rows="4"
              cols="50"
            />
          </div>
        ))}

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
