import request from "./api";
import type { LLMModel, LLMConfig } from "../domain";

type CreateLLMDto = {
    name: string;
    config: LLMConfig;
};

type UpdateLLMDto = {
    id: number;
    name?: string;
    config?: LLMConfig;
};

type LLMResponseDto = {
    llMs: LLMModel[];
    message?: string;
};

export const llmService = {
    // GET /api/llm
    getAll: () =>
        request<LLMResponseDto>("/api/llm").then((res) => res.llMs),

    // GET /api/llm/:id
    getById: (id: number) =>
        request<LLMModel>(`/api/llm/${id}`),

    // POST /api/llm
    create: (data: CreateLLMDto) =>
        request<LLMModel>("/api/llm", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // PUT /api/llm
    update: (data: UpdateLLMDto) =>
        request<LLMModel>("/api/llm", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    // DELETE /api/llm/:id
    delete: (id: number) =>
        request<void>(`/api/llm/${id}`, { method: "DELETE" }),
};