import type { LLMConfig } from "./LLMConfig";

export type LLMModel = {
    id: number;
    name: string;
    config: LLMConfig;
    createdAt: string;
};