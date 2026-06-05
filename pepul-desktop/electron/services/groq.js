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

Return ONLY JSON with properly escaped strings.
`,
     JSON.stringify(
       data,
       null,
       2
     )
   );
 }

 async function generateCode(architecture, wireflow, files) {
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
      "path": "frontend/package.json",
      "content": "..."
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

Context:
Architecture: ${JSON.stringify(architecture || {}, null, 2)}
Wireflow: ${JSON.stringify(wireflow || {}, null, 2)}
Directories: ${JSON.stringify(files || [], null, 2)}

Return ONLY valid JSON with properly escaped strings.
`,
     JSON.stringify({ architecture, wireflow, files }, null, 2)
   );
 }

 async function chatAgent(
   messages,
   currentFileContext,
   model
 ) {
   let fileContextPrompt = "";
   if (currentFileContext && currentFileContext.path) {
     fileContextPrompt = `\nThe user is currently viewing the file "${currentFileContext.path}". Here is its current content:\n\`\`\`\n${currentFileContext.content}\n\`\`\`\n`;
   }

   const systemPrompt = `You are the Antigravity Agent, a senior AI developer embedded within the Antigravity IDE.
 You are helping the user build their project or design their applications.
 ${fileContextPrompt}
 Please chat with the user, answer questions, explain concepts, or offer design recommendations.
 Always format code in standard Markdown blocks. If you write code, the user can click "Apply Code" to automatically overwrite their active file.`;

   const response = await client.chat.completions.create({
     model: model || "llama-3.3-70b-versatile",
     temperature: 0.3,
     messages: [
       { role: "system", content: systemPrompt },
       ...messages
     ]
   });

   return response.choices[0].message.content;
 }

 async function fixCompilationError(
   files,
   errorLog,
   model
 ) {
   const filesContext = files
     .map(
       (f) =>
         `File: ${f.path}\n\`\`\`\n${f.content}\n\`\`\`\n`
     )
     .join("\n");

   const prompt = `We ran the application and encountered the following error/crash during compilation or runtime:

Error Output:
${errorLog}

Here are the source files currently in the workspace:
${filesContext}

You are the Antigravity self-healing agent. Please analyze the error, identify which file needs to be modified, and repair the code to solve the issue.
Return ONLY valid JSON in this exact structure. Do not output markdown, explanations, or any other text.

{
  "files": [
    {
      "path": "path/to/repaired_file",
      "content": "entire corrected file contents here"
    }
  ]
}

Ensure all special characters and newlines are properly escaped in the JSON string.`;

   const response = await client.chat.completions.create({
     model: model || "llama-3.3-70b-versatile",
     temperature: 0.1,
     messages: [
       { role: "user", content: prompt }
     ]
   });

   return response.choices[0].message.content;
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
