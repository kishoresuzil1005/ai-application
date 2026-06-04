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
    <div className="h-12 border-b border-zinc-800 flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 text-sm border-r border-zinc-800 ${
            active === tab
              ? "bg-zinc-900 text-white"
              : "text-zinc-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
