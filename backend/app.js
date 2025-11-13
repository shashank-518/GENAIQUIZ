import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";
import cors from "cors"; // ✅ import cors
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
)

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.get("/home", (req, res) => {
  res.json({
    message: "Welcome to the Animal Quiz API 🐾",
    status: "running",
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { animal } = req.body;

    const prompt = `You are a zoologist and expert quiz master. Generate detailed and educational content about the animal: ${animal}.

Your output should be strictly in JSON format, with no extra text, code blocks, or explanations.

{
  "info": {
    "scientific_name": "",
    "classification": {
      "kingdom": "",
      "phylum": "",
      "class": "",
      "order": "",
      "family": "",
      "genus": ""
    },
    "habitat": "",
    "geographical_distribution": "",
    "diet": "",
    "average_lifespan": "",
    "physical_characteristics": "",
    "behavior_and_social_structure": "",
    "reproduction_and_offspring": "",
    "conservation_status": "",
    "interesting_facts": ["", "", ""]
  },
  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }
  ]
}

Requirements:
- The "info" section should give enough detailed information for students to learn about this animal.
- Generate **10 quiz questions** related to the animal (biology, facts, habits, conservation, etc.).
- The quiz should be multiple-choice, with only one correct answer in the "answer" field.
- Make sure JSON is valid and strictly follows the given structure.
`;

    const result = await model.generateContent(prompt);
    const clean = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate data" });
  }
});

// ✅ start server
app.listen(3001, () =>
  console.log("✅ Backend running on http://localhost:3001")
);
