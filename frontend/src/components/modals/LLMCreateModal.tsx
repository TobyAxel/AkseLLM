import { useEffect, useState } from "react";
import { FiType, FiCpu, FiChevronDown } from "react-icons/fi";
import Modal from "../ui/Modal";
import { useModalStore } from "../../stores/useModalStore";
import { useLLMStore } from "../../stores/useLLMStore";
import { llmService } from "../../services/llmService";
import { ProviderModels } from "../../domain/enums/ProviderModels";
import { LLMProvider } from "../../domain/enums/LLMProvider";
import type { LLMConfig } from "../../domain";

const DEFAULT_CONFIG: LLMConfig = {
    provider: LLMProvider.Ollama,
    model: "",
    temperature: 0.7,
    maxTokens: 200,
    stream: true,
};

function LLMCreateModal() {
    const { activeModal, closeModal } = useModalStore();
    const { addLLM } = useLLMStore();
    const availableModels = ProviderModels[LLMProvider.Ollama];
    const [name, setName] = useState("");
    const [config, setConfig] = useState<LLMConfig>({ ...DEFAULT_CONFIG, model: availableModels[0] ?? "" });
    const [error, setError] = useState<string | null>(null);
    const [advancedOpen, setAdvancedOpen] = useState(false);

    useEffect(() => {
        if (activeModal !== "llmCreate") return;

        setName("");
        setConfig({ ...DEFAULT_CONFIG, model: availableModels[0] ?? "" });
        setAdvancedOpen(false);
        setError(null);
    }, [activeModal]);

    const patch = (partial: Partial<LLMConfig>) =>
        setConfig((prev) => ({ ...prev, ...partial }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !config.model) return;

        try {
            setError(null);
            const llm = await llmService.create({ name: name.trim(), config });
            addLLM(llm);
            setName("");
            setConfig({ ...DEFAULT_CONFIG, model: availableModels[0] ?? "" });
            setAdvancedOpen(false);
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create LLM");
        }
    };

    const inputCls = "w-full bg-neutral-900/50 text-white px-3 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-600 text-sm";
    const labelCls = "block text-neutral-300 text-sm font-medium";

    return (
        <Modal isOpen={activeModal === "llmCreate"} onClose={closeModal} size="md">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-700/50">
                <h2 className="text-xl font-bold text-white">Create a new LLM model</h2>
                <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-5rem)]">
                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="name" className={labelCls}>Name</label>
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
                    <label htmlFor="model" className={labelCls}>Model</label>
                    <div className="relative">
                        <FiCpu className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 z-10" size={18} />
                        <select
                            id="model"
                            value={config.model}
                            onChange={(e) => patch({ model: e.target.value })}
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

                {/* Advanced Settings */}
                <div className="rounded-lg border border-neutral-700/60 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setAdvancedOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800/40 hover:bg-neutral-800/70 transition-colors text-sm font-medium text-neutral-300 hover:text-white cursor-pointer"
                        aria-expanded={advancedOpen}
                    >
                        <span>Advanced settings</span>
                        <FiChevronDown
                            size={16}
                            className={`text-neutral-400 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {advancedOpen && (
                        <div className="p-4 space-y-4 border-t border-neutral-700/60 bg-neutral-900/20">

                            {/* Temperature & Max Tokens */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="temperature" className={labelCls}>Temperature</label>
                                    <input
                                        id="temperature"
                                        type="number" min={0} max={2} step={0.05}
                                        value={config.temperature}
                                        placeholder="0.7"
                                        onChange={(e) => patch({ temperature: e.target.value === "" ? 0.7 : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="maxTokens" className={labelCls}>Max Tokens</label>
                                    <input
                                        id="maxTokens"
                                        type="number" min={1} step={1}
                                        value={config.maxTokens}
                                        placeholder="200"
                                        onChange={(e) => patch({ maxTokens: e.target.value === "" ? 200 : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Top P & Top K */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="topP" className={labelCls}>Top P</label>
                                    <input
                                        id="topP"
                                        type="number" min={0} max={1} step={0.01}
                                        value={config.topP ?? ""}
                                        placeholder="default"
                                        onChange={(e) => patch({ topP: e.target.value === "" ? undefined : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="topK" className={labelCls}>Top K</label>
                                    <input
                                        id="topK"
                                        type="number" min={0} step={1}
                                        value={config.topK ?? ""}
                                        placeholder="default"
                                        onChange={(e) => patch({ topK: e.target.value === "" ? undefined : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Frequency, Presence & Repeat Penalty */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="frequencyPenalty" className={labelCls}>Freq. Penalty</label>
                                    <input
                                        id="frequencyPenalty"
                                        type="number" min={-2} max={2} step={0.01}
                                        value={config.frequencyPenalty ?? ""}
                                        placeholder="default"
                                        onChange={(e) => patch({ frequencyPenalty: e.target.value === "" ? undefined : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="presencePenalty" className={labelCls}>Pres. Penalty</label>
                                    <input
                                        id="presencePenalty"
                                        type="number" min={-2} max={2} step={0.01}
                                        value={config.presencePenalty ?? ""}
                                        placeholder="default"
                                        onChange={(e) => patch({ presencePenalty: e.target.value === "" ? undefined : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="repeatPenalty" className={labelCls}>Repeat Penalty</label>
                                    <input
                                        id="repeatPenalty"
                                        type="number" min={0} step={0.01}
                                        value={config.repeatPenalty ?? ""}
                                        placeholder="default"
                                        onChange={(e) => patch({ repeatPenalty: e.target.value === "" ? undefined : Number(e.target.value) })}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Seed */}
                            <div className="space-y-1.5">
                                <label htmlFor="seed" className={labelCls}>Seed</label>
                                <input
                                    id="seed"
                                    type="number" step={1}
                                    value={config.seed ?? ""}
                                    placeholder="Random"
                                    onChange={(e) => patch({ seed: e.target.value === "" ? undefined : Number(e.target.value) })}
                                    className={inputCls}
                                />
                            </div>

                            {/* Stream toggle */}
                            <div className="flex items-center justify-between py-1">
                                <label htmlFor="stream" className={labelCls}>Stream</label>
                                <button
                                    id="stream"
                                    type="button"
                                    role="switch"
                                    aria-checked={config.stream}
                                    onClick={() => patch({ stream: !config.stream })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${config.stream ? "bg-neutral-500" : "bg-neutral-700"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${config.stream ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Stop Sequences */}
                            <div className="space-y-1.5">
                                <label htmlFor="stopSequences" className={labelCls}>
                                    Stop Sequences
                                    <span className="ml-1.5 text-neutral-500 font-normal">(comma-separated)</span>
                                </label>
                                <input
                                    id="stopSequences"
                                    type="text"
                                    value={config.stopSequences?.join(", ") ?? ""}
                                    placeholder='e.g.  \n, ###, <end>'
                                    onChange={(e) => {
                                        const seqs = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                        patch({ stopSequences: seqs.length ? seqs : undefined });
                                    }}
                                    className={inputCls}
                                />
                            </div>

                            {/* System Prompt */}
                            <div className="space-y-1.5">
                                <label htmlFor="systemPrompt" className={labelCls}>System Prompt</label>
                                <textarea
                                    id="systemPrompt"
                                    rows={4}
                                    value={config.systemPrompt ?? ""}
                                    placeholder="Optional system prompt…"
                                    onChange={(e) => patch({ systemPrompt: e.target.value || undefined })}
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                        </div>
                    )}
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
                        disabled={!name.trim() || !config.model}
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