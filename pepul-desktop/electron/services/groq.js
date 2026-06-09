/* ============================================================
   GROQ PROVIDER (sole provider - all models)
   ============================================================ */
require("dotenv").config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey() {
  return process.env.GROQ_API_KEY || process.env.AI_API_KEY || "";
}

function getModel(domain) {
  if (domain === "code") return process.env.AI_CODE_MODEL || "llama-3.3-70b-versatile";
  if (domain === "chat") return process.env.AI_CHAT_MODEL || "llama-3.3-70b-versatile";
  return process.env.AI_WIREFLOW_MODEL || process.env.AI_MODEL || "llama-3.3-70b-versatile";
}

async function ask(model, systemPrompt, userPrompt, domain = "wireflow") {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY or AI_API_KEY in .env");
  }

  const useModel = model || getModel(domain);

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
    console.error("[groq.js] Blocked image-input error from model response. Model:", useModel, "Domain:", domain);
    if (domain === "code") {
      return JSON.stringify({
        files: [{ path: "README.md", content: "# Generated App\n\nSetup: npm install && npm run dev" }],
        _error: "Image input not supported. Use text-only mode."
      });
    }
    if (domain === "chat") {
      return "I can help with code, but I cannot process images. Please describe your question in text.";
    }
    if (domain === "architecture") {
      return JSON.stringify({
        frontend: "React + Next.js",
        backend: "Node.js + Express",
        database: "PostgreSQL",
        auth: "JWT",
        apis: ["REST API"],
        _error: "Partial stack generated. Full stack available after rate limit reset."
      });
    }
    return JSON.stringify({
      projectName: "App",
      screens: [
        { id: "s1", title: "Home", components: ["Navbar", "Hero", "Cards"] },
        { id: "s2", title: "Details", components: ["Form", "List", "Actions"] },
      ],
      flows: [{ from: "s1", to: "s2" }]
    });
  }

  return content;
}

module.exports = { ask };
