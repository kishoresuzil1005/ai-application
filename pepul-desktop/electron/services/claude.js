/* ============================================================
   CLAUDE.JS — NOW A GROQ ALIAS
   ============================================================ */
require("dotenv").config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey() {
  return process.env.GROQ_API_KEY || process.env.AI_API_KEY || "";
}

async function ask(model, systemPrompt, userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY or AI_API_KEY in .env");
  }

  const useModel = model || "llama-3.3-70b-versatile";

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: useModel,
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
    throw new Error(`Groq Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || "";

  if (!content || typeof content !== "string") {
    content = "";
  }

  if (/image\.png|does not support image input|Inform the user/i.test(content)) {
    console.error("[claude.js->groq] Blocked image-input error. Model:", useModel);
    return "Text-only response: plain-text summary returned instead.";
  }

  return content;
}

module.exports = { ask };
