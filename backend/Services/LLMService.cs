using backend.Models.Domain.DTOs;

namespace backend.Services
{
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

            var result = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Get();

            var response = new LLMResponseDto
            {
                LLMs = result.Models.Select(llm => new LLM
                {
                    Id = llm.Id,
                    Name = llm.Name,
                    Config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig),
                    ChatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory),
                    CreatedAt = llm.CreatedAt
                })
            };

            return response;
        }

        public async Task<LLMResponseDto> GetLLMByIdAsync(int id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            var result = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Get();

            var llm = result.Models.FirstOrDefault();

            if (llm == null) throw new Exception("LLM not found");

            var response = new LLMResponseDto
            {
                LLMs = new List<LLM>
                {
                    new LLM
                    {
                        Id = llm.Id,
                        Name = llm.Name,
                        Config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig),
                        ChatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory),
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

            var newLLM = new LLMEntity
            {
                UserId = user.Id!,
                Name = createLLMDto.Name,
                LLMConfig = JsonSerializer.Serialize(createLLMDto.Config),
                ChatHistory = JsonSerializer.Serialize(new List<Message>())
            };
            var result = await supabase.From<LLMEntity>().Insert(newLLM);
            var llm = result.Models.FirstOrDefault();

            var response = new LLMResponseDto
            {
                LLMs = new List<LLM>
                {
                    new LLM
                    {
                        Id = llm.Id,
                        Name = llm.Name,
                        Config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig),
                        ChatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory),
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

            var existing = await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id)
                .Where(x => x.Id == updateLLMDto.Id)
                .Get();

            var llmEntity = existing.Models.FirstOrDefault();

            if (updateLLMDto.Name != null)
                llmEntity.Name = updateLLMDto.Name;

            if (updateLLMDto.Config != null)
                llmEntity.LLMConfig = JsonSerializer.Serialize(updateLLMDto.Config);

            var result = await supabase.From<LLMEntity>().Update(llmEntity);
            var llm = result.Models.FirstOrDefault();

            var response = new LLMResponseDto
            {
                LLMs = new List<LLM>
                {
                    new LLM
                    {
                        Id = llm.Id,
                        Name = llm.Name,
                        Config = JsonSerializer.Deserialize<LLMConfig>(llm.LLMConfig),
                        ChatHistory = JsonSerializer.Deserialize<List<Message>>(llm.ChatHistory),
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

            await supabase.From<LLMEntity>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Delete();
        }
    }
}