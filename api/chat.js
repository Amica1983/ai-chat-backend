import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({
    apiKey: process.env.YANDEX_API_KEY,
    baseURL: "https://ai.api.cloud.yandex.net/v1",
    defaultHeaders: {
      "OpenAI-Project": process.env.YANDEX_PROJECT_ID
    }
  });

  const { message } = req.body;

  const response = await client.responses.create({
    prompt: {
      id: process.env.YANDEX_PROMPT_ID
    },
    input: message
  });

  res.status(200).json({
    answer: response.output_text
  });
}
