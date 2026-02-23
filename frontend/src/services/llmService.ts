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
        request<LLMResponseDto>(`/api/llm/${id}`).then((res) => res.llMs),

    // POST /api/llm
    create: (data: CreateLLMDto) =>
        request<LLMResponseDto>("/api/llm", {
            method: "POST",
            body: JSON.stringify(data),
        }).then((res) => res.llMs),

    // PUT /api/llm
    update: (data: UpdateLLMDto) =>
        request<LLMResponseDto>("/api/llm", {
            method: "PUT",
            body: JSON.stringify(data),
        }).then((res) => res.llMs),

    // DELETE /api/llm/:id
    delete: (id: number) =>
        request<void>(`/api/llm/${id}`, { method: "DELETE" }),
};