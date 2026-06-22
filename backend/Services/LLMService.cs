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
        Task<LLMResponseDto> UpdateLLMAsync(int id, UpdateLLMDto updateLLMDto, string token, string refreshToken);
        Task DeleteLLMAsync(int id, string token, string refreshToken);
        Task<GetMessagesDto> GetLLMMessagesAsync(int id, string token, string refreshToken);
        Task<GetMessagesDto> SendMessageToLLMAsync(int id, Message message, string token, string refreshToken);
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

            // Fetch only LLMs belonging to the current user (max amount is 15)
            var result = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Limit(15)
                .Get();

            var response = new LLMResponseDto
            {
                LLMs = result.Models.Select(llm =>
                {
                    return new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = llm.LLMConfig!,
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

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm.Id!,
                        Name = llm.Name!,
                        Config = llm.LLMConfig!,
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

            var llmsRaw = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Get();

            var llms = JsonSerializer.Deserialize<List<LLMEntity>>(llmsRaw.Content ?? "[]");

            // Limit llm count to 15, this is also enforced in RLS
            if (llms!.Count >= 15)
                throw new InvalidOperationException("The maximum amount of LLMs you can own has been reached.");

            var newLLM = new LLMEntity
            {
                UserId = user.Id,
                Name = createLLMDto.Name,
                LLMConfig = createLLMDto.Config
            };

            var result = await supabase.From<LLMEntity>().Insert(newLLM);
            var llm = result.Models.FirstOrDefault();

            if (llm == null)
                throw new Exception("Failed to create LLM");

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = llm.LLMConfig!,
                        CreatedAt = llm.CreatedAt
                    }
                }
            };

            return response;
        }

        public async Task<LLMResponseDto> UpdateLLMAsync(int id, UpdateLLMDto updateLLMDto, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);

            var user = supabase.Auth.CurrentUser;
            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Verify the LLM exists and belongs to the current user before updating
            var exists = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Where(x => x.Id == id)
                .Get();

            var llmEntity = exists.Models.FirstOrDefault();

            if (llmEntity == null)
                throw new NotFoundException("LLM not found");

            // Only overwrite fields that were actually provided in the request
            if (updateLLMDto.Name != null)
                llmEntity.Name = updateLLMDto.Name;

            if (updateLLMDto.Config != null)
                llmEntity.LLMConfig = updateLLMDto.Config;

            var result = await supabase.From<LLMEntity>().Update(llmEntity);
            var llm = result.Models.FirstOrDefault();

            if (llm == null)
                throw new Exception("Failed to update LLM");

            var response = new LLMResponseDto
            {
                LLMs = new List<LLMModel>
                {
                    new LLMModel
                    {
                        Id = llm!.Id!,
                        Name = llm.Name!,
                        Config = llm.LLMConfig!,
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

        public async Task<GetMessagesDto> GetLLMMessagesAsync(int id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);

            var user = supabase.Auth.CurrentUser;
            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            var messages = await supabase.From<MessageEntity>()
                .Where(m => m.LLMId == id)
                .Order("created_at", Supabase.Postgrest.Constants.Ordering.Ascending)
                .Limit(10)
                .Get();

            return new GetMessagesDto
            {
                ChatMessages = messages.Models.Select(m => new Message
                {
                    Role = m.Role!,
                    Content = m.Content!,
                    CreatedAt = m.CreatedAt
                }).ToList()
            };
        }

        public async Task<GetMessagesDto> SendMessageToLLMAsync(int id, Message message, string token, string refreshToken)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Content))
                throw new MissingFieldException("No message given");

            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);

            var user = supabase.Auth.CurrentUser;
            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired session");

            // Ensure LLM belongs to user
            var exists = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Get();

            var llm = exists.Models.FirstOrDefault();
            if (llm == null)
                throw new NotFoundException("LLM not found");

            var userMessageEntity = new MessageEntity
            {
                Role = message.Role,
                Content = message.Content,
                LLMId = id,
                CreatedAt = DateTime.UtcNow,
            };

            var insertResult = await supabase
                .From<MessageEntity>()
                .Insert(userMessageEntity);

            var historyResult = await supabase.From<MessageEntity>()
                .Where(m => m.LLMId == id)
                .Order("created_at", Supabase.Postgrest.Constants.Ordering.Ascending)
                .Get();

            var chatHistory = historyResult.Models.ToList();

            // Check if given model is running
            // If not, run up model first

            // Send chat history & config to model
            // Wait for response

            // This is a placeholder response to be fixed once the product is actually complete
            var assistantMessageEntity = new MessageEntity
            {
                Role = "assistant",
                Content = "placeholder",
                LLMId = id,
                CreatedAt = DateTime.UtcNow,
            };

            // Add llm response to chat history
            await supabase
                .From<MessageEntity>()
                .Insert(assistantMessageEntity);

            var response = new GetMessagesDto
            {
                ChatMessages = new List<Message>
                {
                    new Message
                    {
                        Role = assistantMessageEntity.Role!,
                        Content = assistantMessageEntity.Content!,
                        CreatedAt = assistantMessageEntity.CreatedAt
                    }
                }
            };

            return response;
        }
    }
}