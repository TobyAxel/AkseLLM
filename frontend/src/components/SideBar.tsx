import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useState } from "react";
import type { LLM } from "../domain/llm";

type SideBarProps = {
  llms: LLM[];
  selectedLLMId: string | null;
  onSelectLLM: (id: string) => void;
  onCreateClick: () => void;
};

function SideBar({ llms, selectedLLMId, onSelectLLM, onCreateClick }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={twMerge(clsx("h-dvh bg-zinc-950 relative overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "w-62" : "w-12"))}>
      {/* Title */}
      <div className={twMerge(clsx("absolute top-2 left-3 text-2xl", isOpen ? "block" : "hidden"))}>
        <b>AkseLLM</b>
      </div>

      {/* Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="absolute right-1 top-1 cursor-pointer w-10 h-10 pb-1 rounded-md hover:bg-neutral-800" title={isOpen ? "Close Sidebar" : "Open Sidebar"}>
        {isOpen ? "✖" : "☰"}
      </button>

      {/* LLM list */}
      <div className={twMerge(clsx("w-58 mx-2 pt-20 h-30", isOpen ? "block" : "hidden"))}>
        <span>
          <b>LLMs</b>
        </span>

        <ul className="mt-1">
          {llms.map((llm) => {
            const isSelected = llm.id === selectedLLMId;
            return (
              <li key={llm.id} className={twMerge(clsx("rounded-md h-8 flex items-center pl-2 cursor-pointer", isSelected ? "bg-neutral-800" : "hover:bg-neutral-800"))} onClick={() => onSelectLLM(llm.id)}>
                - {llm.name}
              </li>
            );
          })}
        </ul>

        <button className="cursor-pointer mt-1 hover:text-neutral-300" onClick={onCreateClick}>
          <b>+</b>
        </button>
      </div>

      {/* Profile */}
      <div
        className={twMerge(clsx("absolute flex items-center bottom-1 left-1 cursor-pointer h-10 rounded-md hover:bg-neutral-800 transition-all duration-300 ease-in-out", isOpen ? "w-60" : "w-10"))}>
        <img src="/blank-pfp.png" className="w-8 h-8 rounded-full ml-1"/> 
        {isOpen && <span className="pl-2">username1234</span>}
      </div>
    </div>
  );
}

export default SideBar;