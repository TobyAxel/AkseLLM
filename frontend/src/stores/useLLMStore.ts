import { create } from "zustand";
import type { LLMModel } from "../domain";

type LLMStore = {
    llms: LLMModel[];
    selectedLLM: LLMModel | null;

    setLLMs: (llms: LLMModel[]) => void;
    addLLM: (llm: LLMModel) => void;
    removeLLM: (id: number) => void;
    updateLLM: (llm: LLMModel) => void;
    selectLLM: (llm: LLMModel | null) => void;
};

export const useLLMStore = create<LLMStore>((set) => ({
    llms: [],
    selectedLLM: null,

    setLLMs: (llms) => set({ llms }),
    addLLM: (llm) => set((state) => ({ llms: [...state.llms, llm] })),
    removeLLM: (id) => set((state) => ({
        llms: state.llms.filter((l) => l.id !== id),
        selectedLLM: state.selectedLLM?.id === id ? null : state.selectedLLM,
    })),
    updateLLM: (llm) => set((state) => ({
        llms: state.llms.map((l) => l.id === llm.id ? llm : l),
        selectedLLM: state.selectedLLM?.id === llm.id ? llm : state.selectedLLM,
    })),
    selectLLM: (llm) => set({ selectedLLM: llm }),
}));