import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useState } from "react";
import type { LLM } from "../domain/llm";

type SideBarProps = {
  llms: LLM[];
  selectedLLMId: string | null;
  onSelectLLM: (id: string) => void;
  onCreateClick: () => void;
  onAccountClick: () => void;
};

function SideBar({ llms, selectedLLMId, onSelectLLM, onCreateClick, onAccountClick }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={twMerge(clsx(
      "h-dvh bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden transition-all duration-300 ease-in-out border-r border-neutral-800/50",
      isOpen ? "w-62" : "w-14"
    ))}>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-neutral-800/5 to-transparent pointer-events-none" />

      {/* Title */}
      <div className={twMerge(clsx(
        "absolute top-2 left-3 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      ))}>
        <h1 className="text-2xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          AkseLLM
        </h1>
        <div className="h-0.5 w-16 bg-linear-to-r from-neutral-600 to-transparent mt-1 rounded-full" />
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-2 cursor-pointer w-10 h-10 pb-1 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 flex items-center justify-center group backdrop-blur-sm"
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <span className="text-neutral-400 group-hover:text-white transition-colors text-lg">
          {isOpen ? "✖" : "☰"}
        </span>
      </button>

      {/* LLM list */}
      <div className={twMerge(clsx(
        "w-58 mx-2 pt-20 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      ))}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-neutral-300 text-sm tracking-wider">
            LLMS
          </span>
          <div className="h-px flex-1 ml-3 bg-linear-to-r from-neutral-700 to-transparent" />
        </div>

        <ul className="mt-3 space-y-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          {llms.map((llm) => {
            const isSelected = llm.id === selectedLLMId;
            return (
              <li
                key={llm.id}
                className={twMerge(clsx(
                  "rounded-lg h-9 flex items-center pl-3 cursor-pointer transition-all duration-200 group relative overflow-hidden",
                  isSelected
                    ? "bg-neutral-800 shadow-lg shadow-neutral-900/50"
                    : "hover:bg-neutral-800/50"
                ))}
                onClick={() => onSelectLLM(llm.id)}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-neutral-500 to-neutral-700 rounded-r" />
                )}
                <span className={twMerge(clsx(
                  "text-sm transition-colors truncate",
                  isSelected ? "text-white font-medium" : "text-neutral-400 group-hover:text-neutral-200"
                ))}>
                  {llm.name}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          className="cursor-pointer mt-4 w-full h-9 rounded-lg border-2 border-dashed border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/30 transition-all duration-200 flex items-center justify-center group"
          onClick={onCreateClick}
        >
          <span className="text-neutral-500 group-hover:text-neutral-300 font-bold text-lg">+</span>
          <span className="ml-2 text-sm text-neutral-500 group-hover:text-neutral-300 font-medium">New LLM</span>
        </button>
      </div>

      {/* Profile */}
      <div className={twMerge(clsx(
        "absolute flex items-center bottom-2 left-1.5 cursor-pointer h-12 rounded-lg hover:bg-neutral-800/50 transition-all duration-300 ease-in-out group backdrop-blur-sm border border-transparent hover:border-neutral-700/50",
        isOpen ? "w-58.5" : "w-10"))}
        onClick={onAccountClick}>
        <div className="relative">
          <img
            src="/blank-pfp.png"
            className="w-8 h-8 ml-1 rounded-full ring-2 ring-neutral-700 group-hover:ring-neutral-600 transition-all shrink-0"
          />
        </div>
        {isOpen && (
          <div className="absolute left-12 flex-1 min-w-0">
            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors block truncate">
              username1234
            </span>
            <span className="text-xs text-neutral-500">Online</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;