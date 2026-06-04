const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL:
    "https://api.groq.com/openai/v1",
});

async function askGroq(
  systemPrompt,
  userPrompt
) {
  const response =
    await client.chat.completions.create({
      model:
        "llama-3.3-70b-versatile",

      temperature: 0.1,

      messages: [
        {
          role: "system",
          content:
            systemPrompt,
        },
        {
          role: "user",
          content:
            userPrompt,
        },
      ],
    });

  return response.choices[0]
    .message.content;
}

/* --------------------------
   WIREFLOW
-------------------------- */

async function generateWireflow(
  userPrompt
) {
  return askGroq(
    `
You are a Senior UX Architect.

Return ONLY JSON.

{
  "projectName":"",
  "screens":[
    {
      "id":"",
      "title":"",
      "components":[]
    }
  ],
  "flows":[
    {
      "from":"",
      "to":""
    }
  ]
}

Generate actual application screens.
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
  return askGroq(
    `
Return ONLY JSON.

{
  "requirements":[]
}

Generate detailed product requirements.
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
  return askGroq(
    `
Return ONLY JSON.

{
  "frontend":"",
  "backend":"",
  "database":"",
  "auth":"",
  "apis":[]
}

Generate production architecture.
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
  return askGroq(
    `
Return ONLY JSON.

{
  "folders":[]
}

Generate complete project structure.

Example:

[
  "frontend",
  "frontend/src",
  "frontend/src/app",
  "backend",
  "backend/src",
  "database"
]
`,
    architecture
  );
}

async function generateSourceCode(
  data
) {
  return askGroq(
    `
You are a Senior Full Stack Engineer.

CRITICAL: Return ONLY valid, properly escaped JSON. NO markdown code blocks, NO explanations.

Ensure ALL strings in the "content" field are properly escaped:
- Use \\n for newlines
- Use \\" for quotes
- Use \\\\ for backslashes
- Escape all special characters properly

Format:
{
  "files": [
    {
      "path": "frontend/src/app/page.tsx",
      "content": "properly escaped content here with escaped newlines and quotes"
    }
  ]
}

Generate a complete production-ready application.

Requirements:
- Next.js App Router
- TypeScript
- TailwindCSS
- Backend API
- Database layer
- Authentication if needed

Generate ALL files required.

Return ONLY valid JSON with properly escaped strings.
`,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

module.exports = {
  generateWireflow,
  generateRequirements,
  generateArchitecture,
  generateFileStructure,
  generateSourceCode,
};
