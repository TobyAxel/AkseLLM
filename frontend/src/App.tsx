import { useState } from "react";
import SideBar from "./components/SideBar";
import type { LLM } from "./domain/llm";

function App() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);

  const openCreateModal = () => {
    const name = window.prompt("Give LLM name:",);
    if (name === null) return;

    createLLM(name)
  }

  const createLLM = (name: string) => {
    const llm: LLM = {
      id: crypto.randomUUID(),
      name,
      model: "GPT-4"
    };

    setLLMs(prev => [...prev, llm]);
    setSelectedLLMId(llm.id);
  };

  return (
    <div className="flex">
        <SideBar llms={llms} selectedLLMId={selectedLLMId} onSelectLLM={(id) => setSelectedLLMId(id)} onCreateClick={openCreateModal}/>
    </div>
  )
}

export default App
