require("dotenv").config();
require("./database/init");

const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
} = require("electron");

const path = require("path");

const groq = require("./services/groq");

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

  win.loadURL(
    "http://localhost:3000"
  );
}

app.whenReady().then(() => {
  createWindow();
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
   OPEN FOLDER
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
