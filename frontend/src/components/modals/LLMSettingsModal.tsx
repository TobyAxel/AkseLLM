import { FiCpu, FiType, FiX, FiChevronDown } from "react-icons/fi";
import Modal from "../ui/Modal";
import { useModalStore } from "../../stores/useModalStore";
import { LLMProvider, ProviderModels, type LLMConfig } from "../../domain";
import { useState, useEffect } from "react";
import { llmService } from "../../services";
import { useLLMStore } from "../../stores/useLLMStore";

function LLMSettingsModal() {
    const { activeModal, closeModal, llmSettingsTarget } = useModalStore();
    const availableModels = ProviderModels[LLMProvider.Ollama];
    const [name, setName] = useState(llmSettingsTarget?.name ?? "");
    const [config, setConfig] = useState(llmSettingsTarget?.config);
    const [error, setError] = useState<string | null>(null);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const { updateLLM, removeLLM } = useLLMStore();

    useEffect(() => {
        setName(llmSettingsTarget?.name ?? "");
        setConfig(llmSettingsTarget?.config);
        setAdvancedOpen(false);
        setConfirmingDelete(false);
    }, [llmSettingsTarget]);

    useEffect(() => {
        if (!confirmingDelete) return;

        const timeout = setTimeout(() => {
            setConfirmingDelete(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [confirmingDelete]);

    const isUnchanged = name.trim() === llmSettingsTarget?.name && configEquals(config, llmSettingsTarget?.config);

    const patch = (partial: Partial<NonNullable<typeof config>>) =>
        setConfig((prev) => prev ? { ...prev, ...partial } : prev);

    function configEquals(a: LLMConfig | undefined, b: LLMConfig | undefined): boolean {
        if (a === b) return true;
        if (!a || !b) return false;

        const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof LLMConfig>;

        for (const key of keys) {
            const av = a[key];
            const bv = b[key];

            if (Array.isArray(av) && Array.isArray(bv)) {
                if (av.length !== bv.length || av.some((v, i) => v !== bv[i])) return false;
            } else if (av !== bv) {
                return false;
            }
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isUnchanged) return;
        try {
            setError(null);
            const llm = await llmService.update(llmSettingsTarget!.id, {
                name: name.trim(),
                config,
            });
            updateLLM(llm);
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update LLM");
        }
    };

    const deleteLLM = async () => {
        try {
            setError(null);
            await llmService.delete(llmSettingsTarget!.id);
            removeLLM(llmSettingsTarget!.id);
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete LLM");
            setConfirmingDelete(false);
        }
    };

    const inputCls = "w-full bg-surface/50 text-ink px-3 py-2 rounded-lg border border-line focus:outline-none focus:border-line-active focus:ring-2 focus:ring-line-active/20 transition-all placeholder:text-ink-faint text-sm";
    const labelCls = "block text-ink-muted text-sm font-medium";

    return (
        <Modal isOpen={activeModal === "llmSettings"} onClose={closeModal} size="md">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-line/50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-ink">
                        {llmSettingsTarget?.name ?? "LLM Settings"}
                    </h2>
                    <div className="h-0.5 w-20 bg-linear-to-r from-line-strong to-transparent mt-2 rounded-full" />
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 rounded-lg hover:bg-hover/50 transition-all duration-200 text-ink-subtle hover:text-ink cursor-pointer"
                    aria-label="Close LLM settings"
                >
                    <FiX size={20} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-5rem)]">
                {error && (
                    <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="name" className={labelCls}>Name</label>
                    <div className="relative">
                        <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface/50 text-ink pl-10 pr-4 py-2.5 rounded-lg border border-line focus:outline-none focus:border-line-active focus:ring-2 focus:ring-line-active/20 transition-all placeholder:text-ink-faint"
                            placeholder="Enter model name"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Model Select */}
                <div className="space-y-2">
                    <label htmlFor="model" className={labelCls}>Model</label>
                    <div className="relative">
                        <FiCpu className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint z-10" size={18} />
                        <select
                            id="model"
                            value={config?.model ?? ""}
                            onChange={(e) => patch({ model: e.target.value })}
                            className="w-full bg-surface/50 text-ink pl-10 pr-10 py-2.5 rounded-lg border border-line focus:outline-none focus:border-line-active focus:ring-2 focus:ring-line-active/20 transition-all appearance-none cursor-pointer"
                        >
                            {availableModels.map((model) => (
                                <option key={model} value={model} className="bg-raised">{model}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-subtle">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="rounded-lg border border-line/60 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setAdvancedOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-raised/40 hover:bg-raised/70 transition-colors text-sm font-medium text-ink-muted hover:text-ink cursor-pointer"
                        aria-expanded={advancedOpen}
                    >
                        <span>Advanced settings</span>
                        <FiChevronDown
                            size={16}
                            className={`text-ink-subtle transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {advancedOpen && (
                        <div className="p-4 space-y-4 border-t border-line/60 bg-surface/20">

                            {/* Temperature & Max Tokens */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="temperature" className={labelCls}>Temperature</label>
                                    <input
                                        id="temperature"
                                        type="number" min={0} max={2} step={0.05}
                                        value={config?.temperature ?? ""}
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
                                        value={config?.maxTokens ?? ""}
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
                                        value={config?.topP ?? ""}
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
                                        value={config?.topK ?? ""}
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
                                        value={config?.frequencyPenalty ?? ""}
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
                                        value={config?.presencePenalty ?? ""}
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
                                        value={config?.repeatPenalty ?? ""}
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
                                    value={config?.seed ?? ""}
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
                                    aria-checked={config?.stream ?? true}
                                    onClick={() => patch({ stream: !(config?.stream ?? true) })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${(config?.stream ?? true) ? "bg-ink-faint" : "bg-hover"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-ink shadow transition-transform duration-200 ${(config?.stream ?? true) ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Stop Sequences */}
                            <div className="space-y-1.5">
                                <label htmlFor="stopSequences" className={labelCls}>
                                    Stop Sequences
                                    <span className="ml-1.5 text-ink-faint font-normal">(comma-separated)</span>
                                </label>
                                <input
                                    id="stopSequences"
                                    type="text"
                                    value={config?.stopSequences?.join(", ") ?? ""}
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
                                    value={config?.systemPrompt ?? ""}
                                    placeholder="Optional system prompt…"
                                    onChange={(e) => patch({ systemPrompt: e.target.value || undefined })}
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="relative flex justify-end gap-3 pt-4">
                    {confirmingDelete ? (
                        <button
                            type="button"
                            onClick={deleteLLM}
                            aria-label="Confirm delete"
                            className="absolute left-0 px-5 py-2.5 cursor-pointer bg-linear-to-r from-danger-solid to-danger-deep text-ink rounded-lg hover:from-danger-solid hover:to-danger-solid transition-all duration-200 font-medium shadow-lg shadow-danger-deep/30"
                        >
                            Confirm
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmingDelete(true)}
                            aria-label="Delete LLM"
                            className="absolute left-0 px-5 py-2.5 cursor-pointer bg-linear-to-r from-danger-solid to-danger-deep text-ink rounded-lg hover:from-danger-solid hover:to-danger-solid transition-all duration-200 font-medium shadow-lg shadow-danger-deep/30"
                        >
                            Delete
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close LLM update modal"
                        className="px-5 py-2.5 cursor-pointer bg-raised/50 text-ink-muted rounded-lg hover:bg-hover/50 transition-all duration-200 font-medium border border-line/50 hover:border-line-strong"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!name.trim() || isUnchanged}
                        aria-label="Update LLM model"
                        className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-line to-line-strong text-ink rounded-lg hover:from-line-strong hover:to-line-active transition-all duration-200 font-medium shadow-lg shadow-surface/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-line disabled:hover:to-line-strong"
                    >
                        Update
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default LLMSettingsModal;