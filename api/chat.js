import OpenAI from "openai";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  // OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔥 DEBUG ENV (важно — только для проверки)
    console.log("ENV CHECK:", {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "EXISTS" : "MISSING",
      OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID ? "EXISTS" : "MISSING",
      YANDEX_PROMPT_ID: process.env.YANDEX_PROMPT_ID ? "EXISTS" : "MISSING"
    });

    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://ai.api.cloud.yandex.net/v1",
      defaultHeaders: {
        "OpenAI-Project": process.env.OPENAI_PROJECT_ID
      }
    });

    const response = await client.chat.completions.create({
      model: "gpt",
      messages: [
        {
          role: "system",
          content: "Ты AI-помощник Аллы по услугам верстки GetCourse"
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      answer: response.choices?.[0]?.message?.content || "no response"
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      error: "AI request failed",
      details: error.message
    });
  }
}
