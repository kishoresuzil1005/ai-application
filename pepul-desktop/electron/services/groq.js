const OLLAMA_URL =
  "http://localhost:11434/api/generate";

async function askModel(
  systemPrompt,
  userPrompt
) {
  const response =
    await fetch(
      OLLAMA_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          model: "qwen3:4b",
          prompt:
            `${systemPrompt}

${userPrompt}`,
          stream: false,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Ollama Error: ${response.status}`
    );
  }

  const data =
    await response.json();

  return data.response;
}

/* --------------------------
   WIREFLOW
-------------------------- */

async function generateWireflow(
  userPrompt
) {
  return askModel(
    `
You are a Senior UX Architect.

Return ONLY JSON.

{
  "projectName":"",
  "screens":[],
  "flows":[]
}
`,
    userPrompt
  );
}

/* --------------------------
   REQUIREMENTS
-------------------------- */

async function generateRequirements(
  wireflow
) {
  return askModel(
    `
Return ONLY JSON.

{
  "requirements":[]
}
`,
    wireflow
  );
}

/* --------------------------
   ARCHITECTURE
-------------------------- */

async function generateArchitecture(
  wireflow
) {
  return askModel(
    `
Return ONLY JSON.

{
  "frontend":"",
  "backend":"",
  "database":"",
  "apis":[]
}
`,
    wireflow
  );
}

/* --------------------------
   FILE STRUCTURE
-------------------------- */

async function generateFileStructure(
  architecture
) {
  return askModel(
    `
Return ONLY JSON.

{
  "folders":[]
}
`,
    architecture
  );
}

/* --------------------------
   SOURCE CODE
-------------------------- */

async function generateSourceCode(
  data
) {
  return askModel(
    `
Return ONLY JSON.

{
  "files":[
    {
      "path":"",
      "content":""
    }
  ]
}

Generate a complete application.
`,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

/* --------------------------
   CODE
-------------------------- */

async function generateCode(
  architecture,
  wireflow,
  files
) {
  return askModel(
    `
Return ONLY JSON.

{
  "files":[
    {
      "path":"",
      "content":""
    }
  ]
}
`,
    JSON.stringify({
      architecture,
      wireflow,
      files,
    })
  );
}

/* --------------------------
   CHAT
-------------------------- */

async function chatAgent(
  messages
) {
  return askModel(
    "You are a Senior Software Engineer.",
    JSON.stringify(messages)
  );
}

/* --------------------------
   SELF HEALING
-------------------------- */

async function fixCompilationError(
  files,
  errorLog
) {
  return askModel(
    `
You are a Senior Full Stack Engineer.

Fix the compilation error.

Return ONLY JSON.

{
  "files":[
    {
      "path":"",
      "content":""
    }
  ]
}
`,
    `
Error:

${errorLog}

Files:

${JSON.stringify(
  files,
  null,
  2
)}
`
  );
}

module.exports = {
  generateWireflow,
  generateRequirements,
  generateArchitecture,
  generateFileStructure,
  generateSourceCode,
  generateCode,
  chatAgent,
  fixCompilationError,
};