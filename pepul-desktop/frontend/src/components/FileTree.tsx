"use client";

import { useState } from "react";

type Props = {
  paths: string[];
};

type Node = {
  [key: string]: Node;
};

function buildTree(paths: string[]): Node {
  const tree: Node = {};

  paths.forEach((path) => {
    const parts = path.split("/");

    let current = tree;

    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    });
  });

  return tree;
}

function TreeNode({
  name,
  node,
}: {
  name: string;
  node: Node;
}) {
  const [open, setOpen] = useState(true);

  const children = Object.entries(node);

  return (
    <div className="pl-2">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((s) => !s)}
      >
        <div>{open ? "▼" : "▶"}</div>
        <div>📁 {name}</div>
      </div>

      {open && children.length > 0 && (
        <div className="pl-4 mt-1">
          {children.map(([child, value]) => (
            <TreeNode key={child} name={child} node={value} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ paths }: Props) {
  const tree = buildTree(paths || []);

  return (
    <div>
      {Object.entries(tree).map(([name, node]) => (
        <TreeNode key={name} name={name} node={node} />
      ))}
    </div>
  );
}
