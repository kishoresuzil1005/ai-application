const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    openFolder: () =>
      ipcRenderer.invoke(
        "open-folder"
      ),

    generateWireflow: (
      prompt
    ) =>
      ipcRenderer.invoke(
        "generate-wireflow",
        prompt
      ),

    generateRequirements: (
      wireflow
    ) =>
      ipcRenderer.invoke(
        "generate-requirements",
        wireflow
      ),

    generateArchitecture: (
      wireflow
    ) =>
      ipcRenderer.invoke(
        "generate-architecture",
        wireflow
      ),

    generateFileStructure: (
      architecture
    ) =>
      ipcRenderer.invoke(
        "generate-file-structure",
        architecture
      ),

    generateSourceCode: (
      data
    ) =>
      ipcRenderer.invoke(
        "generate-source-code",
        data
      ),

    generateCode: (
      architecture,
      wireflow,
      files
    ) =>
      ipcRenderer.invoke(
        "generate-code",
        architecture,
        wireflow,
        files
      ),

    createProject: (
      folder,
      wireflow,
      architecture,
      generatedFiles
    ) =>
      ipcRenderer.invoke(
        "create-project",
        {
          folder,
          wireflow,
          architecture,
          generatedFiles,
        }
      ),

    getWorkspaceFiles: () =>
      ipcRenderer.invoke("get-workspace-files"),

    readFile: (filePath) =>
      ipcRenderer.invoke("read-file", filePath),

    writeFile: (filePath, content) =>
      ipcRenderer.invoke("write-file", filePath, content),

    searchFiles: (query) =>
      ipcRenderer.invoke("search-files", query),

    getGitStatus: () =>
      ipcRenderer.invoke("get-git-status"),

    askAgent: (messages, currentFile, model) =>
      ipcRenderer.invoke("ask-agent", { messages, currentFile, model }),

    startBuildLoop: (projectName, files, currentTechStack) =>
      ipcRenderer.invoke("start-build-loop", { projectName, files, currentTechStack }),

    stopBuildLoop: () =>
      ipcRenderer.invoke(
        "stop-build-loop"
      ),

    getAIModel: () =>
      ipcRenderer.invoke("get-ai-model"),

    setAIModel: (opts) =>
      ipcRenderer.invoke("set-ai-model", opts),

    onTerminalLog: (callback) => {
      // Clean listener first to avoid duplicate bindings
      ipcRenderer.removeAllListeners("terminal-log");
      ipcRenderer.on("terminal-log", (_, data) => callback(data));
    },

    onBuildStatus: (callback) => {
      // Clean listener first
      ipcRenderer.removeAllListeners("build-status");
      ipcRenderer.on("build-status", (_, status) => callback(status));
    },
  }
);

