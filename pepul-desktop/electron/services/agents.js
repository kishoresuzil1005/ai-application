/* ============================================================
   SPECIALIZED AGENT — Clear sample wireflow + stack
   ============================================================ */
const aiManager = require("./aiManager");

const CLEAR_WIREFLOW = {
  projectName: "Sample App",
  screens: [
    {
      id: "home",
      title: "Home Page",
      components: ["Navigation bar with logo", "Hero section with title", "Feature cards (3 columns)", "Call-to-action button", "Footer with links"]
    },
    {
      id: "about",
      title: "About Page",
      components: ["Page header with breadcrumb", "Company description text", "Team member cards", "Contact form", "Back button"]
    },
    {
      id: "contact",
      title: "Contact Page",
      components: ["Contact form fields", "Email input", "Message textarea", "Submit button", "Social media links"]
    }
  ],
  flows: [
    { from: "home", to: "about" },
    { from: "home", to: "contact" },
    { from: "about", to: "home" },
    { from: "contact", to: "home" }
  ]
};

const SYSTEM_PROMPT = "You are a senior full-stack developer. Return ONLY valid JSON, no markdown.";

function stripImageRequests(input) {
  return input.replace(/\b(image|images?|picture|photo|img)\b[^\n]*/gi, "");
}

async function generateWireflow(prompt) {
  try {
    const result = await aiManager.askAI(
      "You are a UX architect. Return ONLY valid JSON.",
      `Create a clear wireflow diagram JSON for this app idea.\n\nRequired format:\n{\n  "projectName": "AppName",\n  "screens": [\n    {\n      "id": "home",\n      "title": "Home Page",\n      "components": ["Nav bar", "Hero banner", "Feature cards", "CTA button", "Footer"]\n    }\n  ],\n  "flows": [\n    { "from": "home", "to": "about" }\n  ]\n}\n\nApp idea: ${prompt}`,
      "wireflow"
    );
    return result;
  } catch (err) {
    console.error("[agents] wireflow error:", err.message);
    return JSON.stringify(CLEAR_WIREFLOW);
  }
}

async function generateArchitecture(input) {
  const raw = typeof input === "string" ? input : JSON.stringify(input, null, 2);
  const sanitized = stripImageRequests(raw);
  return aiManager.askAI(
    SYSTEM_PROMPT,
    `Recommend a tech stack JSON. Format: {"frontend":"","backend":"","database":"","apis":[]}. No images.\n\n${sanitized}`,
    "code"
  );
}

async function generateRequirements(input) {
  try {
    const result = await aiManager.askAI(
      "You are a business analyst. Return ONLY valid JSON.",
      `List 6-8 functional requirements for this app.\n\nRequired format:\n{\n  "requirements": ["User can login", "User can create tasks", "User can edit tasks"]\n}\n\nApp: ${typeof input === "string" ? input : JSON.stringify(input, null, 2)}`,
      "wireflow"
    );
    return result;
  } catch (err) {
    console.error("[agents] requirements error:", err.message);
    return JSON.stringify({
      requirements: [
        "User authentication (login/logout)",
        "Create and manage tasks",
        "View task dashboard",
        "Edit and delete tasks",
        "Search and filter tasks",
        "Responsive design for mobile"
      ]
    });
  }
}

async function generateFileStructure(input) {
  try {
    const result = await aiManager.askAI(
      "You are a software architect. Return ONLY valid JSON.",
      `List the folder structure for this project.\n\nRequired format:\n{\n  "folders": ["src", "components", "pages", "styles", "utils"]\n}\n\nArchitecture: ${typeof input === "string" ? input : JSON.stringify(input, null, 2)}`,
      "wireflow"
    );
    return result;
  } catch (err) {
    console.error("[agents] file structure error:", err.message);
    return JSON.stringify({
      folders: ["src", "components", "pages", "styles", "utils", "public"]
    });
  }
}

async function generateCode(architecture, wireflow, files) {
  try {
    const result = await aiManager.askAI(
      SYSTEM_PROMPT,
      `Return ONLY this exact JSON format. No markdown, no extra text:\n\n{"files": [{"path": "package.json", "content": "..."}, {"path": "README.md", "content": "..."}]}\n\nCreate a complete Next.js app with these screens:\n${JSON.stringify(typeof wireflow === "string" ? JSON.parse(wireflow) : wireflow, null, 2)}\n\nUse this tech stack:\n${JSON.stringify(typeof architecture === "string" ? JSON.parse(architecture) : architecture, null, 2)}\n\nInclude: package.json, next.config.js, pages/_app.js, pages/index.js, components/Navbar.js, styles/globals.css`,
      "code"
    );
    return result;
  } catch (err) {
    console.error("[agents] code generation error:", err.message);
    return JSON.stringify({
      files: [{ path: "README.md", content: "# Generated App\n\nSetup: npm install && npm run dev" }]
    });
  }
}

async function generateSourceCode(data) {
  try {
    const wireflow = typeof data.wireflow === "string" ? data.wireflow : JSON.stringify(data.wireflow, null, 2);
    const architecture = typeof data.architecture === "string" ? data.architecture : JSON.stringify(data.architecture, null, 2);
    const result = await aiManager.askAI(
      SYSTEM_PROMPT,
      `Generate complete source code as a JSON object with a "files" array. Each file has "path" and "content" fields.\n\nArchitecture: ${architecture}\n\nWireflow: ${wireflow}\n\nRequired format: {"files": [{"path": "package.json", "content": "{...}"}, {"path": "src/index.js", "content": "..."}]}`,
      "code"
    );
    return result;
  } catch (err) {
    console.error("[agents] source code error:", err.message);
    return JSON.stringify({
      files: [{ path: "README.md", content: "# Generated App\n\nSetup: npm install && npm run dev" }]
    });
  }
}

async function askAgent(messages, currentFile, model) {
  const aiConfig = require("../config/aiConfig");
  const systemPrompt = "You are a Senior Software Engineer helping with code.";
  const userPrompt = JSON.stringify({ messages, currentFile }, null, 2);
  const result = await aiManager.askAI(systemPrompt, userPrompt, "chat", model);
  return result;
}

async function startBuildLoop(projectName, files, currentTechStack) {
  const result = await aiManager.askAI(
    "You are a build engineer. Analyze the project and return ONLY a JSON array of terminal build commands.",
    JSON.stringify({ projectName, files, currentTechStack }, null, 2),
    "code"
  );
  return result;
}

module.exports = {
  generateWireflow,
  generateArchitecture,
  generateRequirements,
  generateFileStructure,
  generateCode,
  generateSourceCode,
  askAgent,
  startBuildLoop,
};