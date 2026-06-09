"use client";

import React from "react";

import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function ScreenNode({
  data,
}: any) {
  const components = Array.isArray(data.components) ? data.components : [];

  const renderComponent = (c: any, idx: number) => {
    if (typeof c === "string") return <div key={idx}>{c}</div>;
    if (c && typeof c === "object") {
      const text = c.label || c.name || c.type || c.id || `Component ${idx + 1}`;
      return <div key={idx}>{text}</div>;
    }
    return null;
  };

  return (
    <div
      style={{
        width: 300,
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: 14,
        padding: 16,
        color: "white",
        boxShadow:
          "0 10px 30px rgba(0,0,0,.35)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
      />

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 10,
          color: "#e2e8f0",
        }}
      >
        {data.title || data.name || "Screen"}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {components.length > 0 ? (
          components.map((c: any, index: number) => renderComponent(c, index))
        ) : (
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            No components defined
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

const nodeTypes = {
  screen: ScreenNode,
};

export default function GeneratedWireflow({
  wireflow,
}: any) {
  if (!wireflow) return null;

  const screens = Array.isArray(wireflow.screens)
    ? wireflow.screens
    : Array.isArray(wireflow.app?.screens)
      ? wireflow.app.screens
      : [];
  const flows = Array.isArray(wireflow.flows)
    ? wireflow.flows
    : Array.isArray(wireflow.app?.flows)
      ? wireflow.app.flows
      : [];

  const nodes = screens.map(
    (screen: any, index: number) => {
      const components = Array.isArray(screen.components)
        ? screen.components.map((c: any) =>
            typeof c === "string" ? c : (c?.label || c?.name || c?.type || c?.id || String(c))
          ).filter(Boolean)
        : [];

      const nodeId = screen.id || `screen-${index}`;
      const title = screen.title || screen.name || `Screen ${index + 1}`;

      return {
        id: nodeId,
        type: "screen",
        position: {
          x: 500,
          y: index * 260,
        },
        data: {
          title,
          components,
        },
      };
    }
  );

  const edges = flows
    .map(
      (flow: any, index: number) => {
        const source = typeof flow === "string" ? flow : (flow?.from || flow?.source || flow?.id);
        const target = typeof flow === "string" ? "" : (flow?.to || flow?.target || flow?.id);
        if (!source || !target) return null;
        return {
          id: `edge-${index}`,
          source,
          target,
          animated: true,
        };
      }
    )
    .filter(Boolean);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#030712",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
