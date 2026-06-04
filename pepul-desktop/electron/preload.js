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

    createProject: (
      folder,
      wireflow,
      architecture
    ) =>
      ipcRenderer.invoke(
        "create-project",
        {
          folder,
          wireflow,
          architecture,
        }
      ),
  }
);
