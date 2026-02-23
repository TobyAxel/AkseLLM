import { useState } from "react";
import { FiType, FiCpu } from "react-icons/fi";
import Modal from "../../ui/Modal";
import { useModalStore } from "../../../stores/useModalStore";
import { useLLMStore } from "../../../stores/useLLMStore";
import { llmService } from "../../../services/llmService";
import { ProviderModels } from "../../../domain/enums/ProviderModels";
import { LLMProvider } from "../../../domain/enums/LLMProvider";

function LLMCreateModal() {
    const { activeModal, closeModal } = useModalStore();
    const { addLLM } = useLLMStore();

    const availableModels = ProviderModels[LLMProvider.Ollama];
    const [name, setName] = useState("");
    const [selectedModel, setSelectedModel] = useState(availableModels[0] ?? "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !selectedModel) return;

        try {
            setError(null);
            const llm = await llmService.create({
                name: name.trim(),
                config: {
                    provider: LLMProvider.Ollama,
                    model: selectedModel,
                    temperature: 0.7,
                    maxTokens: 200,
                    stream: true,
                },
            });
            addLLM(llm[0]);
            setName("");
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create LLM");
        }
    };

    return (
        <Modal isOpen={activeModal === "llmCreate"} onClose={closeModal} size="md">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-700/50">
                <h2 className="text-xl font-bold text-white">Create a new LLM model</h2>
                <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 space-y-5">
                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-neutral-300 text-sm font-medium">Name</label>
                    <div className="relative">
                        <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-neutral-900/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                            placeholder="Enter model name"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Model Select */}
                <div className="space-y-2">
                    <label htmlFor="model" className="block text-neutral-300 text-sm font-medium">Model</label>
                    <div className="relative">
                        <FiCpu className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 z-10" size={18} />
                        <select
                            id="model"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full bg-neutral-900/50 text-white pl-10 pr-10 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all appearance-none cursor-pointer"
                        >
                            {availableModels.map((model) => (
                                <option key={model} value={model} className="bg-neutral-800">{model}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close LLM creation modal"
                        className="px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || !selectedModel}
                        aria-label="Create LLM model"
                        className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                    >
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default LLMCreateModal;