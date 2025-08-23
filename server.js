import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

// Enable CORS for all websites
app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST"], // allow GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
}));

app.use(express.json());

// Topics & subtopics
const topics = {
  "Computer Science": ["HTML", "CSS", "Python", "Java", "JavaScript", "Operating System", "DSA"],
  Mathematics: ["Arithmetic", "Geometry", "Algebra", "Trigonometry", "Calculus", "Probability", "Statistics", "Discrete Mathematics"],
  Science: ["Physics", "Chemistry", "Biology", "Biochemistry", "Astronomy"],
  Philosophy: ["Metaphysics", "Ethics", "Epistemology", "Logic", "Aesthetics", "Existentialism & Phenomenology"],
  Automobile: ["IC Engine", "EC Engine", "Electric Vehicle", "Automotive Electronics"]
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
  if (typeof q.correct_index !== "number" || q.correct_index < 0 || q.correct_index > 3) {
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
      { headers: { "Content-Type": "application/json", "X-goog-api-key": API_KEY } }
    );

    const candidate = response.data?.candidates?.[0];
    const rawText = extractAIText(candidate);

    let data = [];
    try {
      const match = rawText.match(/\[.*\]/s);
      if (match) data = JSON.parse(match[0]);
    } catch { data = []; }

    const validated = data.map(validateQuestion).filter(q => q).slice(0, count);
    return validated.length > 0 ? validated : generateDummyQuestions(topic, subtopic, difficulty, count);

  } catch (err) {
    console.error("AI generation failed, using dummy questions:", err.message);
  }
}

// API endpoints
app.get("/topics", (req, res) => res.json(topics));

app.post("/generate-quiz", async (req, res) => {
  const { topic, subtopic, difficulty, numQuestions } = req.body;
  console.log(numQuestions)
  if (!topic || !subtopic) return res.status(400).json({ error: "Topic and subtopic required" });
  const questions = await getQuestions(topic, subtopic, difficulty || "easy", numQuestions || 5);
  res.json(questions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
