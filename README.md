The Movie Recommendation AI Chatbot is designed to eliminate the frustration of spending 20-30 minutes scrolling through trailers just to pick a movie. Inspired by this common struggle, the app leverages cutting-edge technology to provide seamless and intelligent movie recommendations.

On the frontend, the app uses React to create a dynamic and user-friendly interface that ensures a smooth and engaging user experience. The backend harnesses the power of OpenAI’s vector embedding API, which enables the app to understand user preferences with remarkable accuracy, far beyond the capabilities of simple keyword matching.

When a user inputs their movie preferences, the app translates this input into embeddings—complex, multi-dimensional vectors that encapsulate the nuanced meaning of the preferences. These embeddings are then cross-referenced with a static list of movies, which have been pre-converted into vectors and stored in a Supabase vector database.

The app performs a sophisticated query to find the movie with the highest similarity score to the user’s input. Once the best match is identified, the recommendation is enhanced with a conversational touch using OpenAI’s chatbot completion model. This ensures that the final output feels like a natural, engaging conversation, providing users with a personalized and enjoyable movie-picking experience.

As a minimal viable product (MVP), the app currently uses a static list of movies for initial cross-referencing. Despite this, the core functionality showcases the app's ability to deliver accurate and satisfying recommendations efficiently.

In summary, the Movie Recommendation AI Chatbot combines advanced AI technology with an intuitive interface to make movie selection quick, accurate, and enjoyable, transforming a traditionally time-consuming task into a delightful experience.

<img width="728" alt="Screenshot 2024-06-05 at 13 03 59" src="https://github.com/Evgenii-Dolgopolov/ai-movie-recommendation-app/assets/52101591/d80b46dd-87e1-45f3-8135-804c44bee1ca">
