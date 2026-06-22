import request from "./api";
import type { LLMModel, LLMConfig, Message } from "../domain";

type CreateLLMDto = {
    name: string;
    config: LLMConfig;
};

type UpdateLLMDto = {
    name?: string;
    config?: LLMConfig;
};

type LLMResponseDto = {
    llMs: LLMModel[];
    message?: string;
};

type GetMessagesDto = {
    chatMessages: Message[],
    message?: string;
}

export const llmService = {
    // GET /api/llm
    getAll: () =>
        request<LLMResponseDto>("/api/llm").then((res) => res.llMs),

    // GET /api/llm/:id
    getById: (id: number) =>
        request<LLMResponseDto>(`/api/llm/${id}`).then((res) => res.llMs[0]),

    // POST /api/llm
    create: (data: CreateLLMDto) =>
        request<LLMResponseDto>("/api/llm", {
            method: "POST",
            body: JSON.stringify(data),
        }).then((res) => res.llMs[0]),

    // PUT /api/llm
    update: (id: number, data: UpdateLLMDto) =>
        request<LLMResponseDto>(`/api/llm/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }).then((res) => res.llMs[0]),

    // DELETE /api/llm/:id
    delete: (id: number) =>
        request<void>(`/api/llm/${id}`, { method: "DELETE" }),

    // Get /api/llm/:id/chat
    getMessages: (id: number) =>
        request<GetMessagesDto>(`/api/llm/${id}/chat`).then((res) => res.chatMessages),

    // POST /api/llm/:id/chat
    sendMessage: (id: number, message: Message) =>
        request<GetMessagesDto>(`/api/llm/${id}/chat`, {
            method: "POST",
            body: JSON.stringify(message)
        }).then((res) => res.chatMessages[0])
};