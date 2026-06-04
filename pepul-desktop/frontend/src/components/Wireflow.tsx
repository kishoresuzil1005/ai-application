"use client";

import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "Home" },
    type: "default",
  },

  {
    id: "2",
    position: { x: 250, y: 120 },
    data: { label: "Menu" },
    type: "default",
  },

  {
    id: "3",
    position: { x: 250, y: 240 },
    data: { label: "Checkout" },
    type: "default",
  },
];

const edges = [
  {
    id: "e1",
    source: "1",
    target: "2",
  },

  {
    id: "e2",
    source: "2",
    target: "3",
  },
];

export default function Wireflow() {
  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
}
