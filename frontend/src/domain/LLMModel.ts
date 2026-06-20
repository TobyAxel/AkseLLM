import type { LLMConfig } from "./LLMConfig";
import type { Message } from "./Message";

export type LLMModel = {
    id: number;
    name: string;
    config: LLMConfig;
    chatHistory?: Message[];
    createdAt: string;
};