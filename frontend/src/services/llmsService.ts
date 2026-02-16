import type { LLMDto } from "../domain/DTOs/LLMDto";
import { api } from "./api";

export const llmsService = {
    async getLLMs() {
        const response = await api.get<LLMDto[]>('api/llms');
        return response.data;
    },

    async getLLMById(id: string) {
        const response = await api.get<LLMDto>(`api/llms/${id}`);
        return response.data;
    },

    async createLLM(data: Omit<LLMDto, 'id'>) {
        const response = await api.post<LLMDto>('api/llms', data);
        return response.data;
    },

    async deleteLLM(id: string) {
        await api.delete(`api/llms/${id}`);
    }
}