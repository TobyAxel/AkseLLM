export const LLMProvider = {
    Ollama: "Ollama",
} as const;

export type LLMProvider = typeof LLMProvider[keyof typeof LLMProvider];