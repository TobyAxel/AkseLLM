import type { InferenceConfig } from "../inferenceConfig";

export type LLMDto = {
    id: string;
    name: string;
    model: string;
    inferenceConfig: InferenceConfig | null;
    message?: string; // Optional message field for API responses
};