"use client";

import { useState } from "react";
import GeneratedWireflow from "@/components/GeneratedWireflow";

export default function Home() {
  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [wireflow, setWireflow] =
    useState<any>(null);

  const [requirements, setRequirements] =
    useState<any[]>([]);

  const [architecture, setArchitecture] =
    useState<any>(null);

  const [files, setFiles] =
    useState<any[]>([]);

  const [projectFolder, setProjectFolder] =
  useState("");

  const [creatingProject, setCreatingProject] =
  useState(false);

  const [diagramApproved, setDiagramApproved] =
  useState(false);

  const [activeTab, setActiveTab] =
    useState("Wireflow");

  const [showChanges, setShowChanges] =
    useState(false);

  const [changeRequest, setChangeRequest] =
    useState("");

  const parseJson = (
    raw: string
  ) => {
    const start =
      raw.indexOf("{");

    const end =
      raw.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1
    ) {
      throw new Error(
        "Invalid JSON response"
      );
    }

    return JSON.parse(
      raw.slice(
        start,
        end + 1
      )
    );
  };

  const analyzeIdea =
    async () => {
      if (!prompt.trim()) {
        alert(
          "Enter your idea"
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await window.electronAPI.generateWireflow(
            prompt
          );

        if (
          !response.success
        ) {
          throw new Error(
            response.error
          );
        }

        const parsed =
          parseJson(
            response.data || ""
          );

        setWireflow(parsed);

        setRequirements(
          []
        );

        setArchitecture(
          null
        );

        setFiles([]);

        setDiagramApproved(
          false
        );

        setActiveTab(
          "Wireflow"
        );
      } catch (error: any) {
        alert(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };
const approveDiagram =
  async () => {
    try {
      setLoading(true);

      const reqResponse =
        await window.electronAPI.generateRequirements(
          wireflow
        );

      setRequirements([
        {
          title:
            "Requirements",
          content:
            reqResponse.data,
        },
      ]);

      const archResponse =
        await window.electronAPI.generateArchitecture(
          wireflow
        );

      setArchitecture(
        archResponse.data
      );

      const filesResponse =
        await window.electronAPI.generateFileStructure(
          archResponse.data
        );

      const folders =
        (filesResponse.data || "")
          .split("\n")
          .filter(
            (line: string) =>
              line.trim()
          );

      setFiles(folders);

      setDiagramApproved(
        true
      );

      setActiveTab(
        "Architecture"
      );
    } catch (error: any) {
      console.error(error);

      alert(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const generateApp =
  async () => {
    try {
      setCreatingProject(true);

      const folder =
        await window.electronAPI.openFolder();

      if (!folder) {
        return;
      }

      setProjectFolder(folder);

      const response =
        await window.electronAPI.createProject(
          folder,
          wireflow,
          architecture
        );

      if (!response.success) {
        throw new Error(
          response.error
        );
      }

      alert(
        `Project created successfully!

Location:
${response.root}`
      );
    } catch (error: any) {
      alert(
        error.message
      );
    } finally {
      setCreatingProject(false);
    }
  };

const submitChanges =
  async () => {
    const updatedPrompt = `
${prompt}

Additional Changes:

${changeRequest}
`;

    setPrompt(
      updatedPrompt
    );

    setShowChanges(
      false
    );

    setChangeRequest(
      ""
    );

    setDiagramApproved(
      false
    );

    try {
      setLoading(true);

      const response =
        await window.electronAPI.generateWireflow(
          updatedPrompt
        );

      if (
        !response.success
      ) {
        throw new Error(
          response.error
        );
      }

      const parsed =
        parseJson(
          response.data || ""
        );

      setWireflow(parsed);

      setRequirements(
        []
      );

      setArchitecture(
        null
      );

      setFiles([]);

      setActiveTab(
        "Wireflow"
      );
    } catch (error: any) {
      alert(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="h-screen bg-[#0d1117] text-white flex">

      {/* LEFT */}

      <div className="w-80 border-r border-zinc-800 flex flex-col">

        <div className="p-5 border-b border-zinc-800">
          <h2 className="font-semibold text-lg">
            Project Idea
          </h2>
        </div>

        <div className="p-4">

          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(
                e.target.value
              )
            }
            placeholder="Describe your application..."
            className="
              w-full
              h-[300px]
              bg-[#161b22]
              rounded-lg
              p-4
              resize-none
              border
              border-zinc-800
            "
          />

          <button
            onClick={
              analyzeIdea
            }
            disabled={
              loading
            }
            className="
              w-full
              mt-4
              bg-green-600
              py-3
              rounded-lg
            "
          >
            {loading
              ? "Analyzing..."
              : "Analyze Idea"}
          </button>

        </div>

      </div>

      {/* CENTER */}

      <div className="flex-1 flex flex-col">

        <div className="flex border-b border-zinc-800">

          {[
            "Requirements",
            "Wireflow",
            "Architecture",
            "Files",
          ].map(
            (tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab
                  )
                }
                className={`
                  px-6 py-4 border-r border-zinc-800
                  ${
                    activeTab ===
                    tab
                      ? "bg-[#1f2937]"
                      : ""
                  }
                `}
              >
                {tab}
              </button>
            )
          )}

        </div>

        <div className="flex-1 overflow-auto">

          {activeTab ===
            "Requirements" && (
            <div className="p-8">

              {requirements.length ===
              0 ? (
                <div>
                  Approve diagram first
                </div>
              ) : (
                requirements.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="mb-3"
                    >
                      • {item}
                    </div>
                  )
                )
              )}

            </div>
          )}

          {activeTab ===
            "Wireflow" && (
            <div className="h-full">

              {wireflow ? (
                <>
                  <div className="h-[80vh]">

                    <GeneratedWireflow
                      wireflow={
                        wireflow
                      }
                    />

                  </div>

                  <div className="border-t border-zinc-800 p-4 flex gap-3">

                    <button
                      onClick={
                        approveDiagram
                      }
                      className="
                        bg-green-600
                        px-5
                        py-2
                        rounded-lg
                      "
                    >
                      {loading
                        ? "Generating..."
                        : "Approve Diagram"}
                    </button>

                    {diagramApproved && (
                      <button
                        onClick={
                          generateApp
                        }
                        className="
                          bg-blue-600
                          px-5
                          py-2
                          rounded-lg
                        "
                      >
                        {creatingProject
                          ? "Creating..."
                          : "Generate App"}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setShowChanges(
                          true
                        )
                      }
                      className="
                        bg-zinc-800
                        px-5
                        py-2
                        rounded-lg
                      "
                    >
                      Request Changes
                    </button>

                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">
                  Analyze an idea to generate a wireflow
                </div>
              )}

            </div>
          )}

          {activeTab ===
            "Architecture" && (
            <div className="p-8">

              {!architecture ? (
                <div>
                  Approve diagram first
                </div>
              ) : (
                <div className="space-y-4">

                  <div>
                    Frontend:
                    {" "}
                    {
                      architecture.frontend
                    }
                  </div>

                  <div>
                    Backend:
                    {" "}
                    {
                      architecture.backend
                    }
                  </div>

                  <div>
                    Database:
                    {" "}
                    {
                      architecture.database
                    }
                  </div>

                  <div>
                    Auth:
                    {" "}
                    {
                      architecture.auth
                    }
                  </div>

                </div>
              )}

            </div>
          )}

          {activeTab ===
            "Files" && (
            <div className="p-8">

              {files.length ===
              0 ? (
                <div>
                  Approve diagram first
                </div>
              ) : (
                files.map(
                  (
                    file,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="mb-2"
                    >
                      📄 {file}
                    </div>
                  )
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* RIGHT */}

      <div className="w-96 border-l border-zinc-800">

        <div className="p-5 border-b border-zinc-800">
          <h2 className="font-semibold">
            Agent
          </h2>
        </div>

        <div className="p-4 overflow-auto h-[90vh]">

          {wireflow ? (
            <>
              <div className="text-zinc-400">
                Project
              </div>

              <div className="font-bold text-lg">
                {
                  wireflow.projectName
                }
              </div>

              <div className="mt-6 text-zinc-400">
                Screens
              </div>

              {wireflow.screens?.map(
                (
                  screen: any
                ) => (
                  <div
                    key={
                      screen.id
                    }
                    className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded
                      px-3
                      py-2
                      mb-2
                    "
                  >
                    ✓{" "}
                    {
                      screen.title
                    }
                  </div>
                )
              )}
            </>
          ) : (
            <div className="text-zinc-500">
              Waiting for prompt...
            </div>
          )}

        </div>

      </div>

      {/* CHANGE MODAL */}

      {showChanges && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-[#161b22] p-6 rounded-xl w-[600px]">

            <h2 className="text-xl font-bold mb-4">
              Request Changes
            </h2>

            <textarea
              value={
                changeRequest
              }
              onChange={(e) =>
                setChangeRequest(
                  e.target.value
                )
              }
              placeholder="Describe required changes..."
              className="
                w-full
                h-40
                bg-[#0d1117]
                border
                border-zinc-800
                rounded-lg
                p-4
              "
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() =>
                  setShowChanges(
                    false
                  )
                }
                className="
                  px-4
                  py-2
                  bg-zinc-700
                  rounded-lg
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  submitChanges
                }
                className="
                  px-4
                  py-2
                  bg-green-600
                  rounded-lg
                "
              >
                Update Diagram
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}
