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

      createProject(
        folder: string,
        wireflow: any,
        architecture: any
      ): Promise<{
        success: boolean;
        root?: string;
        error?: string;
      }>;
    };
  }
}
