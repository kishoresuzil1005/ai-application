const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const aiConfig = {
  provider: process.env.AI_WIREFLOW_PROVIDER || "groq",
  model: process.env.AI_WIREFLOW_MODEL || "llama-3.3-70b-versatile",
  codeProvider: process.env.AI_CODE_PROVIDER || "groq",
  codeModel: process.env.AI_CODE_MODEL || "llama-3.3-70b-versatile",
  chatProvider: process.env.AI_CHAT_PROVIDER || "groq",
  chatModel: process.env.AI_CHAT_MODEL || "llama-3.3-70b-versatile",
};

module.exports = aiConfig;
