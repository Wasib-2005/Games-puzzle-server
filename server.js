import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Allow CORS for all origins (you can restrict to your domain if needed)
app.use(cors({
  origin: ["https://games-puzzle.onrender.com", "*"] // "*" allows all, or specify your frontend
}));

// Static topics
const topics = {
  "Computer Science": ["HTML", "CSS", "Python", "Java", "JavaScript", "Operating System", "DSA"],
  Mathematics: ["Arithmetic", "Geometry", "Algebra", "Trigonometry", "Calculus", "Probability", "Statistics", "Discrete Mathematics"],
  Science: ["Physics", "Chemistry", "Biology", "Biochemistry", "Astronomy"],
  Philosophy: ["Metaphysics", "Ethics", "Epistemology", "Logic", "Aesthetics", "Existentialism & Phenomenology"],
  Automobile: ["IC Engine", "EC Engine", "Electric Vehicle", "Automotive Electronics"]
};

// Static quiz data
const staticQuestions = [
  {
    question: "Solve for x: x + 5 = 12",
    options: ["7", "17", "60", "-7"],
    correct_index: 0,
    explanation: "Subtract 5 from both sides of the equation: x + 5 - 5 = 12 - 5, so x = 7."
  },
  {
    question: "Which expression represents 'twice a number'?",
    options: ["x + 2", "x - 2", "2x", "x/2"],
    correct_index: 2,
    explanation: "Twice a number means multiplying the number by 2, which is 2x."
  },
  {
    question: "If y = 3x, what is the value of y when x = 4?",
    options: ["1", "7", "12", "1/12"],
    correct_index: 2,
    explanation: "Substitute x = 4 into y = 3x, giving y = 12."
  },
  {
    question: "Simplify: 5a + 2a - a",
    options: ["6a", "8a", "7a", "5a"],
    correct_index: 0,
    explanation: "Combine like terms: 5a + 2a - a = 6a."
  },
  {
    question: "What is the value of 'n' in the equation n/2 = 8?",
    options: ["4", "10", "16", "6"],
    correct_index: 2,
    explanation: "Multiply both sides by 2 to get n = 16."
  }
];

// API endpoints
app.get("/topics", (req, res) => {
  res.json(topics);
});

// Changed route to /quiz to match your requirement
app.get("/quiz", (req, res) => {
  res.json(staticQuestions);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
