export {};

declare global {
  interface Window {
    electronAPI: {
      openFolder(): Promise<string | null>;

      generateWireflow(
        prompt: string
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      generateRequirements(
        wireflow: any
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      generateArchitecture(
        wireflow: any
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      generateFileStructure(
        architecture: any
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      generateSourceCode(
        data: any
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      generateCode(
        architecture: any,
        wireflow: any,
        files: any[]
      ): Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;

      createProject(
        folder: string,
        wireflow: any,
        architecture: any,
        generatedFiles?: any[] | null
      ): Promise<{
        success: boolean;
        root?: string;
        error?: string;
      }>;

      getWorkspaceFiles(): Promise<any[]>;

      readFile(filePath: string): Promise<{ success: boolean; content?: string; error?: string }>;

      writeFile(filePath: string, content: string): Promise<{ success: boolean; error?: string }>;

      searchFiles(query: string): Promise<{ filePath: string; lineNumber: number; lineContent: string }[]>;

      getGitStatus(): Promise<{ branch: string; modifiedFiles: { path: string; status: string }[] }>;

      askAgent(
        messages: any[],
        currentFile: any,
        model: string
      ): Promise<{ success: boolean; data?: string; error?: string }>;

      startBuildLoop(
        projectName: string,
        files: any[],
        currentTechStack: any
      ): Promise<{ success: boolean; error?: string }>;

      stopBuildLoop(): Promise<{ success: boolean }>;

      getAIModel(): Promise<{
        provider: string;
        model: string;
        codeProvider: string;
        codeModel: string;
        chatProvider: string;
        chatModel: string;
      }>;

      setAIModel(opts: {
        provider: string;
        model: string;
        domain?: string;
      }): Promise<boolean>;

      onTerminalLog(callback: (log: string) => void): void;

      onBuildStatus(callback: (status: string) => void): void;
    };
  }
}