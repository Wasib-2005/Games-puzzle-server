# Collage Project 5th Server

This is the backend server for the Collage Project 5th, providing quiz questions for a variety of topics and subtopics. It is built with Node.js and Express, and uses the Google Gemini API for AI-generated questions.

## Features
- REST API for quiz generation
- Supports multiple topics and subtopics
- AI-powered question generation (fallback to dummy questions if AI fails)
- CORS enabled for all origins
- Easy configuration via environment variables

## Endpoints
- `GET /topics` — Returns all available topics and subtopics
- `POST /generate-quiz` — Generates a quiz based on topic, subtopic, difficulty, and number of questions

## Technologies Used
- Node.js
- Express
- Axios
- Dotenv
- CORS

## Setup & Usage
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Google API key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   PORT=5000 # or any port you prefer
   ```
4. Start the server:
   ```bash
   npm start      # for production
   npm run dev    # for development (nodemon)
   ```
5. The server will run at `http://localhost:5000` (or your chosen port)

## Author
Wasib

## License
ISC

---
Project is now archived and no longer maintained.
