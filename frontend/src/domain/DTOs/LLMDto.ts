import type { InterferenceConfig } from "../interferenceConfig";

export type LLMDto = {
    id: string;
    name: string;
    model: string;
    inferenceConfig: InterferenceConfig;
};