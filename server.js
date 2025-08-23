import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

// Enable CORS for all websites
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST"], // allow GET and POST requests
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
  })
);

app.use(express.json());

// Topics & subtopics
const topics = {
  "Anime & Manga": [
    "Naruto",
    "One Piece",
    "Attack on Titan",
    "Demon Slayer",
    "Studio Ghibli",
  ],
  Automobile: [
    "IC Engine",
    "EC Engine",
    "Electric Vehicle",
    "Automotive Electronics",
  ],
  "Books & Literature": [
    "Harry Potter",
    "Percy Jackson",
    "Classics",
    "Modern Novels",
    "Mythology",
  ],
  "Cartoons & Comics": [
    "Marvel Superheroes",
    "DC Superheroes",
    "Disney Classics",
    "Cartoon Network Shows",
    "Anime vs Cartoon",
  ],
  "Computer Science": [
    "HTML",
    "CSS",
    "Python",
    "Java",
    "JavaScript",
    "Operating System",
    "DSA",
  ],
  "Daily Life Trivia": [
    "Food & Drinks",
    "Household Gadgets",
    "Famous Brands",
    "Daily Science Facts",
  ],
  Entertainment: [
    "Netflix Originals",
    "Popular TV Shows",
    "Oscars & Awards",
    "Celebrities & Pop Culture",
  ],
  "Fun Facts": [
    "Weird World Records",
    "Random Knowledge",
    "Amazing Inventions",
  ],
  Gaming: [
    "Minecraft",
    "Roblox",
    "PUBG / Free Fire",
    "Call of Duty",
    "Retro Games",
  ],
  History: [
    "World War I",
    "World War II",
    "Ancient Civilizations",
    "Famous Leaders",
    "Historical Inventions",
  ],
  "Internet & Tech": [
    "Memes",
    "Social Media Trends",
    "Famous YouTubers",
    "Tech Companies",
  ],
  "Jokes & Humor": ["Puns", "Riddles", "Funny Facts"],
  Mathematics: [
    "Arithmetic",
    "Geometry",
    "Algebra",
    "Trigonometry",
    "Calculus",
    "Probability",
    "Statistics",
    "Discrete Mathematics",
  ],
  Music: ["Pop", "Rock & Classics", "Hip-Hop & Rap", "K-Pop", "Instruments"],
  Nature: ["Wildlife", "Space & Astronomy", "Oceans", "National Parks"],
  Philosophy: [
    "Metaphysics",
    "Ethics",
    "Epistemology",
    "Logic",
    "Aesthetics",
    "Existentialism & Phenomenology",
  ],
  Psychology: ["Human Behavior", "Personality Types", "Mind Tricks"],
  Sports: ["Football", "Cricket", "Basketball", "Olympics", "Esports"],
  "Travel & Geography": [
    "Countries & Capitals",
    "Landmarks",
    "World Flags",
    "Cultural Facts",
  ],
  "Universe & Space": ["Planets & Moons", "NASA Missions", "Famous Astronauts"],
  "Weird Science": [
    "Human Body Oddities",
    "Strange Experiments",
    "Weird Animal Facts",
  ],
  "Youth Trends": [
    "Fashion Trends",
    "Gaming Culture",
    "Social Media Challenges",
  ],
  Zoology: ["Animal Kingdom", "Endangered Species", "Marine Biology"],
};

// Extract AI text
function extractAIText(candidate) {
  if (!candidate || !candidate.content) return "";
  let texts = [];
  function processContent(content) {
    if (Array.isArray(content)) content.forEach(processContent);
    else if (content && typeof content === "object") {
      if (content.text) texts.push(content.text);
      else if (content.parts) processContent(content.parts);
    }
  }
  processContent(candidate.content);
  return texts.join(" ");
}

// Validate question
function validateQuestion(q) {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return null;
  if (
    typeof q.correct_index !== "number" ||
    q.correct_index < 0 ||
    q.correct_index > 3
  ) {
    q.correct_index = 0;
  }
  return q;
}

// Main quiz generator
async function getQuestions(topic, subtopic, difficulty, count = 5) {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();

  try {
    const prompt = `Generate ${count} diverse multiple-choice questions for ${topic} - ${subtopic} with difficulty ${difficulty}. 
Vary stems and numeric values; avoid repeating templates. 
Output JSON array only. Schema: {"question": string, "options": [4 strings], "correct_index": int(0-3), "explanation": string}`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
      }
    );

    const candidate = response.data?.candidates?.[0];
    const rawText = extractAIText(candidate);

    let data = [];
    try {
      const match = rawText.match(/\[.*\]/s);
      if (match) data = JSON.parse(match[0]);
    } catch {
      data = [];
    }

    const validated = data
      .map(validateQuestion)
      .filter((q) => q)
      .slice(0, count);
    return validated.length > 0
      ? validated
      : generateDummyQuestions(topic, subtopic, difficulty, count);
  } catch (err) {
    console.error("AI generation failed, using dummy questions:", err.message);
  }
}

// API endpoints
app.get("/topics", (req, res) => res.json(topics));

app.post("/generate-quiz", async (req, res) => {
  const { topic, subtopic, difficulty, numQuestions } = req.body;
  console.log(numQuestions);
  if (!topic || !subtopic)
    return res.status(400).json({ error: "Topic and subtopic required" });
  const questions = await getQuestions(
    topic,
    subtopic,
    difficulty || "easy",
    numQuestions || 5
  );
  res.json(questions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
