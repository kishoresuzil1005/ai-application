"use client";

type Props = {
  active: string;
  setActive: (tab: string) => void;
};

const tabs = [
  "Requirements",
  "Wireflow",
  "Architecture",
  "Files",
];

export default function Tabs({
  active,
  setActive,
}: Props) {
  return (
    <div className="h-12 border-b border-zinc-800 flex bg-[#111827]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 border-r border-zinc-800 text-sm ${
            active === tab
              ? "bg-[#1f2937] text-white"
              : "text-zinc-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
