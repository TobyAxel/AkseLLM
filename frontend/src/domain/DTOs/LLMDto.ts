import type { InterferenceConfig } from "../interferenceConfig";

export type LLMDto = {
    id: string;
    name: string;
    model: string;
    inferenceConfig: InterferenceConfig | null;
    message?: string; // Optional message field for API responses
};