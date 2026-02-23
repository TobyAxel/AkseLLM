using backend.Helpers;
using backend.Models.Domain;
using backend.Models.Common;
using backend.Models.DTOs.LLM;
using Supabase.Gotrue;
using backend.Exceptions;
using System.Collections.Generic;
using System.Text.Json;

namespace backend.Services
{
    // Defines CRUD operations for user-owned LLM configurations
    public interface ILLMService
    {
        Task<LLMResponseDto> GetAllLLMsAsync(string token, string refreshToken);
        Task<LLMResponseDto> GetLLMByIdAsync(int id, string token, string refreshToken);
        Task<LLMResponseDto> CreateLLMAsync(CreateLLMDto createLLMDto, string token, string refreshToken);
        Task<LLMResponseDto> UpdateLLMAsync(UpdateLLMDto updateLLMDto, string token, string refreshToken);
        Task DeleteLLMAsync(int id, string token, string refreshToken);
    }

    public class LLMService : ILLMService
    {
        public async Task<LLMResponseDto> GetAllLLMsAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Fetch only LLMs belonging to the current user
            var result = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Get();

            var response = new LLMResponseDto
            {
                LLMs = result.Models.Select(llm =>
                {
                    // Config and chat history are stored as JSON strings in the DB, deserialize them back
                    var config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig!);
                    var chatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory!);

                    return new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = config!,
                        ChatHistory = chatHistory,
                        CreatedAt = llm.CreatedAt
                    };
                })
            };

            return response;
        }

        public async Task<LLMResponseDto> GetLLMByIdAsync(int id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Filter by both user ID and LLM ID to prevent users accessing each other's LLMs
            var result = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Get();

            var llm = result.Models.FirstOrDefault();

            if (llm == null) throw new NotFoundException("LLM not found");

            var config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig!);
            var chatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory!);

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm.Id!,
                        Name = llm.Name!,
                        Config = config!,
                        ChatHistory = chatHistory,
                        CreatedAt = llm.CreatedAt
                    }
                }
            };

            return response;
        }

        public async Task<LLMResponseDto> CreateLLMAsync(CreateLLMDto createLLMDto, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            var newLLM = new LLMEntity
            {
                UserId = user.Id,
                Name = createLLMDto.Name,
                LLMConfig = JsonSerializer.Serialize(createLLMDto.Config),
                ChatHistory = JsonSerializer.Serialize(new List<Message>()) // Start with empty chat history
            };

            var result = await supabase.From<LLMEntity>().Insert(newLLM);
            var llm = result.Models.FirstOrDefault();

            if (llm == null)
                throw new Exception("Failed to create LLM");

            var config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig!);
            var chatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory!);

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = config!,
                        ChatHistory = chatHistory,
                        CreatedAt = llm.CreatedAt
                    }
                }
            };

            return response;
        }

        public async Task<LLMResponseDto> UpdateLLMAsync(UpdateLLMDto updateLLMDto, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Verify the LLM exists and belongs to the current user before updating
            var existing = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Where(x => x.Id == updateLLMDto.Id)
                .Get();

            var llmEntity = existing.Models.FirstOrDefault();

            if (llmEntity == null)
                throw new NotFoundException("LLM not found");

            // Only overwrite fields that were actually provided in the request
            if (updateLLMDto.Name != null)
                llmEntity.Name = updateLLMDto.Name;

            if (updateLLMDto.Config != null)
                llmEntity.LLMConfig = JsonSerializer.Serialize(updateLLMDto.Config);

            var result = await supabase.From<LLMEntity>().Update(llmEntity);
            var llm = result.Models.FirstOrDefault();

            if (llm == null)
                throw new Exception("Failed to update LLM");

            var config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig!);
            var chatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory!);

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = config!,
                        ChatHistory = chatHistory,
                        CreatedAt = llm.CreatedAt
                    }
                }
            };

            return response;
        }

        public async Task DeleteLLMAsync(int id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Filter by both user ID and LLM ID to prevent users deleting each other's LLMs
            await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Delete();
        }
    }
}