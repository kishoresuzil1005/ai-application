/* ============================================================
   GEMINI.JS — OpenRouter proxy (for non-Groq models)
   ============================================================ */
require("dotenv").config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getApiKey() {
  return process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
}

async function ask(model, systemPrompt, userPrompt, domain = "wireflow") {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY or OPENAI_API_KEY in .env");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://localhost:3000",
      "X-Title": "Pepul Desktop",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

module.exports = { ask };
