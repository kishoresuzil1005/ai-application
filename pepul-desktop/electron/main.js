require("dotenv").config();
require("./database/init");

const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
} = require("electron");

const fs = require("fs");
const path = require("path");

const groq = require("./services/groq");

function extractJsonString(raw) {
  let text = raw.trim();
  text = text.replace(/```(?:json)?\n?/gi, "").trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON response from source generation");
  }

  let jsonStr = text.slice(start, end + 1);
  
  try {
    // Try to parse as-is first
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError.message);
    console.error("Position:", parseError.message.match(/position \d+/)?.[0]);
    
    // Try to fix common issues: unterminated strings in content fields
    // Replace problematic newlines in string values with escaped newlines
    jsonStr = jsonStr.replace(/"content":\s*"([^"]|\\")*$/gm, (match) => {
      // Find unclosed strings and add closing quote
      const lastQuote = match.lastIndexOf('"');
      if (lastQuote > 0 && lastQuote === match.length - 1) {
        return match + '"';
      }
      return match;
    });

    try {
      JSON.parse(jsonStr);
      return jsonStr;
    } catch (e) {
      // If still failing, throw original error
      throw parseError;
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    backgroundColor: "#0f1117",

    webPreferences: {
      preload: path.join(
        __dirname,
        "preload.js"
      ),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const loadURL = (retries = 0) => {
    win.loadURL(
      "http://localhost:3000"
    ).catch((error) => {
      if (retries < 10) {
        console.log(`Failed to load http://localhost:3000. Retrying... (${retries + 1}/10)`);
        setTimeout(() => {
          loadURL(retries + 1);
        }, 1000);
      } else {
        console.error("Failed to load frontend after 10 retries:", error);
        win.webContents.loadURL(`data:text/html,
          <html>
            <body style="background: #0f1117; color: #c9d1d9; font-family: system-ui; padding: 40px; text-align: center;">
              <h1>Failed to Connect to Frontend</h1>
              <p>Make sure Next.js dev server is running on http://localhost:3000</p>
              <p style="color: #8b949e; margin-top: 20px;">Error: ${error.message}</p>
              <button onclick="location.reload()" style="background: #238636; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 20px;">Retry</button>
            </body>
          </html>
        `);
      }
    });
  };

  loadURL();

  // Handle dev tools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on(
    "activate",
    () => {
      if (
        BrowserWindow.getAllWindows()
          .length === 0
      ) {
        createWindow();
      }
    }
  );
});

app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !== "darwin"
    ) {
      app.quit();
    }
  }
);

/* --------------------------
   GENERATE CODE
-------------------------- */

ipcMain.handle(
  "generate-code",
  async (
    _,
    architecture,
    wireflow,
    files
  ) => {
    try {
      const result =
        await groq.generateCode(
          architecture,
          wireflow,
          files
        );
        console.log(
  "\n===== RAW CODE RESPONSE =====\n"
);

console.log(result);

console.log(
  "\n=============================\n"
);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

/* --------------------------
   WORKSPACE SCANNER & EDITORS
-------------------------- */

ipcMain.handle(
  "open-folder",
  async () => {
    const result =
      await dialog.showOpenDialog({
        properties: [
          "openDirectory",
        ],
      });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0];
  }
);

/* --------------------------
   WIREFLOW
-------------------------- */

ipcMain.handle(
  "generate-wireflow",
  async (_, prompt) => {
    try {
      const result =
        await groq.generateWireflow(
          prompt
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

/* --------------------------
   REQUIREMENTS
-------------------------- */

ipcMain.handle(
  "generate-requirements",
  async (_, wireflow) => {
    try {
      const result =
        await groq.generateRequirements(
          typeof wireflow ===
            "string"
            ? wireflow
            : JSON.stringify(
                wireflow,
                null,
                2
              )
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

/* --------------------------
   ARCHITECTURE
-------------------------- */

ipcMain.handle(
  "generate-architecture",
  async (_, wireflow) => {
    try {
      const result =
        await groq.generateArchitecture(
          typeof wireflow ===
            "string"
            ? wireflow
            : JSON.stringify(
                wireflow,
                null,
                2
              )
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

/* --------------------------
   FILE STRUCTURE
-------------------------- */

ipcMain.handle(
  "generate-file-structure",
  async (
    _,
    architecture
  ) => {
    try {
      const result =
        await groq.generateFileStructure(
          typeof architecture ===
            "string"
            ? architecture
            : JSON.stringify(
                architecture,
                null,
                2
              )
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

ipcMain.handle(
  "generate-source-code",
  async (_, data) => {
    try {
      const result =
        await groq.generateSourceCode(
          data
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

ipcMain.handle(
  "create-project",
  async (_, data) => {
    try {
      const projectName =
        data.wireflow?.projectName ||
        "generated-app";

      const root = path.join(
        data.folder,
        projectName
          .replace(/\s+/g, "-")
          .toLowerCase()
      );

      fs.mkdirSync(root, {
        recursive: true,
      });

      const sourceCode =
        await groq.generateSourceCode(
          {
            wireflow:
              data.wireflow,
            architecture:
              data.architecture,
          }
        );

      let parsed;
      try {
        parsed =
          JSON.parse(
            extractJsonString(
              sourceCode
            )
          );
      } catch (parseError) {
        console.error("Failed to parse generated JSON:", sourceCode.substring(0, 500));
        throw new Error(`Invalid JSON from code generation: ${parseError.message}`);
      }

      for (const file of parsed.files) {
        const filePath =
          path.join(
            root,
            file.path
          );

        fs.mkdirSync(
          path.dirname(
            filePath
          ),
          {
            recursive: true,
          }
        );

        fs.writeFileSync(
          filePath,
          file.content
        );
      }

      return {
        success: true,
        root,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error:
          error.message,
      };
    }
  }
);

