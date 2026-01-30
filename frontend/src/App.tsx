import { useState } from "react";
import SideBar from "./components/SideBar";
import type { LLM } from "./domain/llm";
import LLMCreateModal from "./components/LLMCreateModal";

// Temporary variables for frontend testing
const availableModelsTemp = ["Gemini 3 Pro", "GPT-5", "Claude 3.7 Sonnet", "Grok 4"]

function App() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);
  const [llmCreationModalOpen, setLLMCreationModalOpen] = useState(false);

  // Functions
  const handleLLMSelection = (id: string) => {
    setSelectedLLMId(id);
  };

  const openCreateModal = () => {
    setLLMCreationModalOpen(true);
  };

  const closeCreateModal = () => {
    setLLMCreationModalOpen(false);
  }

  const createLLM = (name: string, model: string) => {
    // Update into database
    const newLLM = {
      id: Date.now().toString(),
      name,
      model
    }

    setLLMs(prev => [...prev, newLLM])
  }

  return (
    <div className="flex">
      {llmCreationModalOpen ? <LLMCreateModal availableModels={availableModelsTemp} onLLMCreate={createLLM} onModalClose={closeCreateModal}/> : null}
      <SideBar llms={llms} selectedLLMId={selectedLLMId} onSelectLLM={handleLLMSelection} onCreateClick={openCreateModal}/>
    </div>
  )
}

export default App
