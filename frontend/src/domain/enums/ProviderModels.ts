import { LLMProvider } from "./LLMProvider";

export const ProviderModels: Record<LLMProvider, string[]> = {
    [LLMProvider.Ollama]: ["llama3.2", "mistral", "deepseek-r1", "phi4"],
};