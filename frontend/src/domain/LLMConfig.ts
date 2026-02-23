import type { LLMProvider } from "./enums/LLMProvider";

export type LLMConfig = {
    provider: LLMProvider;
    model: string;
    temperature: number;       // default 0.7
    maxTokens: number;         // default 200
    stream: boolean;           // default true
    systemPrompt?: string;
    topP?: number;
    topK?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    repeatPenalty?: number;
    seed?: number;
    stopSequences?: string[];
};