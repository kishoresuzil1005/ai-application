"use client";

import React, { useState, useEffect } from "react";

type FileItem = {
  path: string;
  name: string;
  isDirectory?: boolean;
  content?: string;
  children?: FileItem[];
};

type Props = {
  files: any[];
  onSelectFile: (file: FileItem) => void;
  selectedFile: FileItem | null;
  gitModifiedFiles?: string[]; // list of paths that are modified
};

// SVG Icon Components for maximum portability and high fidelity
function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="w-4 h-4 text-yellow-500/90 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {open ? (
        <path d="M19 5.5h-5.28l-2-2H3v15h18V5.5H19zm1 12H4v-11h6.12l2 2H20v9z" />
      ) : (
        <path d="M20 5.5h-7.28l-2-2H3v15h18V5.5h-1zm0 12H4v-11h8.12l2 2H20v9z" />
      )}
    </svg>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
      return (
        <svg className="w-4 h-4 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v18h18V3H3zm15 14.5c0 .8-.7 1.5-1.5 1.5h-2c-.8 0-1.5-.7-1.5-1.5v-1h1.5v1h2v-3h-2v-4h3.5v1.5h-2v1h2v4.5zm-5.5-.5c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-1h1.5v1h2.5v-2H7v-3h3.5v1.5H8v1h2.5v3.5z" />
        </svg>
      );
    case "ts":
      return (
        <svg className="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v18h18V3H3zm15 4v1.5h-2.5v10H14v-10H11.5V7H18zm-7.5 7.5c0 .8-.7 1.5-1.5 1.5H7c-.8 0-1.5-.7-1.5-1.5v-1H7v1h2v-3H7v-4h3.5V10H8.5v1h2v3.5z" />
        </svg>
      );
    case "tsx":
    case "jsx":
      return (
        <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="7" ry="2.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="7" ry="2.5" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="7" ry="2.5" transform="rotate(150 12 12)" />
        </svg>
      );
    case "html":
      return (
        <svg className="w-4 h-4 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "css":
      return (
        <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 2l1.6 15.6L12 22l5.4-4.4L19 2H5zm11.2 5.5H8.7l.2 2.2h7.1l-.3 3.3L12 14.5l-3.7-1.5-.2-2.2H6l.4 5.3L12 19l5.6-2.9.6-8.6z" />
        </svg>
      );
    case "json":
      return (
        <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 9H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1M16 9h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
        </svg>
      );
    case "md":
      return (
        <svg className="w-4 h-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 13.5h-2V12h-2v4.5h-2V10h2v1h2V10h2v6.5zm7 0h-2l-1.5-2.5-1.5 2.5h-2l2.5-4.5-2.5-4.5h2l1.5 2.5 1.5-2.5h2l-2.5 4.5 2.5 4.5z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
}

// Convert flat files from LLM code gen to nested tree structure
function buildFileTree(files: any[]): FileItem[] {
  const root: FileItem[] = [];

  const validFiles = files.filter((file) => file && typeof file === "object" && typeof file.path === "string");

  validFiles.forEach((file) => {
    const parts = file.path.split("/");
    let currentLevel = root;

    parts.forEach((part: string, index: number) => {
      const isLast = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join("/");
      
      let existing = currentLevel.find((item) => item.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          isDirectory: !isLast,
          ...(isLast ? { content: file.content } : { children: [] }),
        };
        currentLevel.push(existing);
      }

      if (!isLast && existing.children) {
        currentLevel = existing.children;
      }
    });
  });

  const sortTree = (items: FileItem[]): FileItem[] => {
    return items
      .map((item) => {
        if (item.children) {
          item.children = sortTree(item.children);
        }
        return item;
      })
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  };

  return sortTree(root);
}

function TreeNode({
  item,
  level,
  onSelectFile,
  selectedFile,
  gitModifiedFiles = [],
}: {
  item: FileItem;
  level: number;
  onSelectFile: (file: FileItem) => void;
  selectedFile: FileItem | null;
  gitModifiedFiles?: string[];
}) {
  const [open, setOpen] = useState(true);

  const isFolder = item.isDirectory || (item.children && item.children.length > 0);
  const isSelected = selectedFile?.path === item.path;
  const isModified = gitModifiedFiles.some(
    (p) => p === item.path || p.startsWith(item.path + "/")
  );

  return (
    <div>
      <div
        className={`
          group
          flex
          items-center
          gap-2
          py-1.5
          pr-3
          cursor-pointer
          transition-colors
          duration-150
          relative
          ${
            isSelected
              ? "bg-[#21262d] text-white"
              : "text-zinc-400 hover:bg-[#161b22] hover:text-zinc-200"
          }
        `}
        style={{
          paddingLeft: `${level * 12 + 12}px`,
        }}
        onClick={() => {
          if (isFolder) {
            setOpen((s) => !s);
          } else {
            onSelectFile(item);
          }
        }}
      >
        {/* Selection indicator border */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-500" />
        )}

        {/* Collapsible arrow */}
        <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
          {isFolder && (
            <svg
              className={`w-2.5 h-2.5 text-zinc-500 transition-transform ${
                open ? "rotate-90" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>

        {/* File / Folder Icon */}
        {isFolder ? (
          <FolderIcon open={open} />
        ) : (
          <FileIcon name={item.name} />
        )}

        {/* File Name with Git state coloring */}
        <span
          className={`text-xs font-mono truncate select-none ${
            isModified ? "text-amber-500" : ""
          }`}
        >
          {item.name}
        </span>

        {/* Git modified marker circle */}
        {isModified && (
          <span className="ml-auto text-[10px] text-amber-500 font-bold tracking-tighter shrink-0 pr-1 select-none">
            •
          </span>
        )}
      </div>

      {/* Children list with indentation guides */}
      {isFolder && open && item.children && item.children.length > 0 && (
        <div className="relative">
          {/* Vertical indentation guide line */}
          <div
            className="absolute border-l border-zinc-800/60 top-0 bottom-0"
            style={{
              left: `${level * 12 + 18}px`,
            }}
          />
          {item.children.map((child) => (
            <TreeNode
              key={child.path}
              item={child}
              level={level + 1}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
              gitModifiedFiles={gitModifiedFiles}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTreeExplorer({
  files,
  onSelectFile,
  selectedFile,
  gitModifiedFiles = [],
}: Props) {
  // Check if structure is already nested (from backend) or flat (from LLM generateCode)
  const hasValidItems = files.some((file) => file && typeof file === "object");
  const isNested = hasValidItems && files[0]?.isDirectory !== undefined;
  const tree = isNested ? files : buildFileTree(files);

  if (tree.length === 0) {
    return (
      <div className="p-4 text-xs text-zinc-500 text-center select-none font-mono">
        No files in workspace
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0d1117] py-2">
      {tree.map((item) => (
        <TreeNode
          key={item.path}
          item={item}
          level={0}
          onSelectFile={onSelectFile}
          selectedFile={selectedFile}
          gitModifiedFiles={gitModifiedFiles}
        />
      ))}
    </div>
  );
}
