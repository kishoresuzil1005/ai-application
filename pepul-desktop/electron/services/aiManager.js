/* ============================================================
   AI MANAGER — All traffic through Groq
   ============================================================ */
const aiConfig = require("../config/aiConfig");
const groq = require("./groq");
const gemini = require("./gemini");

const FALLBACK_WIREFLOW = {
  projectName: "Generated App",
  screens: [
    { id: "home", title: "Home", components: ["Header with logo", "Hero banner", "Feature cards", "Action button"] },
    { id: "dashboard", title: "Dashboard", components: ["Sidebar navigation", "Stats cards", "Data table", "User profile"] },
    { id: "settings", title: "Settings", components: ["Profile form", "Toggle switches", "Save button", "Back button"] },
  ],
  flows: [
    { from: "home", to: "dashboard" },
    { from: "dashboard", to: "settings" },
  ],
};

async function askAI(systemPrompt, userPrompt, domain = "wireflow", modelOverride) {
  const model = modelOverride?.model
    || (domain === "code" ? aiConfig.codeModel
    : domain === "chat" ? aiConfig.chatModel
    : aiConfig.model);

  const provider = modelOverride?.provider || aiConfig[domain + "Provider"] || aiConfig.provider;

  if (provider !== "groq") {
    return gemini.ask(model, systemPrompt, userPrompt, domain);
  }

  try {
    return await groq.ask(model, systemPrompt, userPrompt, domain);
  } catch (err) {
    console.error(`[${domain}] groq failed:`, err.message);
    
    const isRateLimit = /429|rate.limit|tokens per day|quota/i.test(err.message);
    
    if (isRateLimit) {
      return JSON.stringify({
        ...FALLBACK_WIREFLOW,
        _warning: "Rate limit reached. Showing sample wireflow. Try again in a minute."
      });
    }
    
    return JSON.stringify({
      ...FALLBACK_WIREFLOW,
      projectName: "App",
      screens: FALLBACK_WIREFLOW.screens.slice(0, 1),
      flows: [],
      _error: err.message
    });
  }
}

module.exports = { askAI };
