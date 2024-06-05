This app is an AI-powered movie recommendation chatbot designed to save users from the endless scrolling of movie trailers and the frustration of spending 20-30 minutes just to pick a movie. The application leverages modern technologies to provide a seamless and intelligent movie-picking experience.

Frontend
Framework: React
Purpose: Provides dynamic rendering and a user-friendly interface, making the user interaction smooth and engaging.
Backend
API: OpenAI’s Vector Embedding API
Database: Supabase Vector Database
How It Works
User Input: Users input their movie preferences through a series of questions.
Embedding Generation: The app translates the user input into embeddings using OpenAI's vector embedding API. This process ensures a deep understanding of user preferences beyond simple keyword matching.
Cross-Reference: These user embeddings are then cross-referenced with a static list of pre-stored movie vectors in the Supabase vector database.
Similarity Query: The app performs a query to find the movie with the highest similarity score to the user's preferences.
Recommendation: The app uses OpenAI’s chatbot completion model to add a conversational touch to the output, providing a personalized and engaging movie recommendation.
MVP Details
Static List of Movies: Currently, the app uses a static list of movies that are converted into vectors for initial cross-referencing. This is a minimal viable product (MVP) approach aimed at demonstrating the core functionality.
Key Features
Accurate Recommendations: By using vector embeddings, the app ensures high accuracy in understanding user preferences and matching them with the best movie choices.
Conversational Output: The integration of OpenAI's chatbot model ensures that the recommendation feels like a natural conversation, enhancing user satisfaction.
Efficient Movie Picking: The app dramatically reduces the time users spend picking a movie, making the process quick and enjoyable.

The Movie Recommendation AI Chatbot is designed to eliminate the frustration of spending 20-30 minutes scrolling through trailers just to pick a movie. Inspired by this common struggle, the app leverages cutting-edge technology to provide seamless and intelligent movie recommendations.

On the frontend, the app uses React to create a dynamic and user-friendly interface that ensures a smooth and engaging user experience. The backend harnesses the power of OpenAI’s vector embedding API, which enables the app to understand user preferences with remarkable accuracy, far beyond the capabilities of simple keyword matching.

When a user inputs their movie preferences, the app translates this input into embeddings—complex, multi-dimensional vectors that encapsulate the nuanced meaning of the preferences. These embeddings are then cross-referenced with a static list of movies, which have been pre-converted into vectors and stored in a Supabase vector database.

The app performs a sophisticated query to find the movie with the highest similarity score to the user’s input. Once the best match is identified, the recommendation is enhanced with a conversational touch using OpenAI’s chatbot completion model. This ensures that the final output feels like a natural, engaging conversation, providing users with a personalized and enjoyable movie-picking experience.

As a minimal viable product (MVP), the app currently uses a static list of movies for initial cross-referencing. Despite this, the core functionality showcases the app's ability to deliver accurate and satisfying recommendations efficiently.

In summary, the Movie Recommendation AI Chatbot combines advanced AI technology with an intuitive interface to make movie selection quick, accurate, and enjoyable, transforming a traditionally time-consuming task into a delightful experience.

<img width="728" alt="Screenshot 2024-06-05 at 13 03 59" src="https://github.com/Evgenii-Dolgopolov/ai-movie-recommendation-app/assets/52101591/d80b46dd-87e1-45f3-8135-804c44bee1ca">
