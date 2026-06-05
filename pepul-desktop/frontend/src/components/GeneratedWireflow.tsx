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
  return (
    <div
      style={{
        width: 280,
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
          marginBottom: 12,
        }}
      >
        {data.title}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {data.components?.map(
          (
            component: any,
            index: number
          ) => {
            // Handle both string and object components
            const text = typeof component === 'string' 
              ? component 
              : (component?.name || component?.type || JSON.stringify(component));
            return (
              <div
                key={index}
                style={{
                  fontSize: 12,
                  color: "#cbd5e1",
                }}
              >
                • {text}
              </div>
            );
          }
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

  const nodes =
    wireflow.screens?.map(
      (
        screen: any,
        index: number
      ) => {
        const components = (screen.components || []).map((c: any) =>
          typeof c === 'string' ? c : (c?.name || c?.type || '')
        ).filter(Boolean);
        return {
          id: screen.id,
          type: "screen",
          position: {
            x: 500,
            y: index * 240,
          },
          data: {
            title: screen.title,
            components,
          },
        };
      }
    ) || [];

  const edges =
    wireflow.flows?.map(
      (
        flow: any,
        index: number
      ) => ({
        id: `edge-${index}`,
        source: flow.from,
        target: flow.to,
        animated: true,
      })
    ) || [];

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
