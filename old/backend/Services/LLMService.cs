using System.Text.Json;
using backend.Helpers;
using backend.Models.DTOs;
using backend.Models.SupaBaseModels;

namespace backend.Services
{
    public interface ILLMService
    {
        Task<LLMDto> CreateLLMAsync(CreateLLMDto createDto, string token, string refreshToken);
        Task<IEnumerable<LLMDto>> GetAllLLMsAsync(string token, string refreshToken);
        Task<LLMDto> GetLLMByIdAsync(string id, string token, string refreshToken);
        Task DeleteLLMAsync(string id, string token, string refreshToken);
    }

    public class LLMService : ILLMService
    {
        public async Task<IEnumerable<LLMDto>> GetAllLLMsAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null) throw new Exception("Invalid token");

            // Get all LLMs for the user
            var result = await supabase.From<LLM>()
                .Where(x => x.UserId == user.Id)
                .Get();

            // Map to DTOs
            var llms = result.Models.Select(llm => new LLMDto
            {
                Id = llm.Id,
                Name = llm.Name,
                Model = llm.Model,
                InferenceConfig = JsonSerializer.Deserialize<InferenceConfig>(llm.InferenceConfigJson) ?? new InferenceConfig()
            });

            return llms;
        }

        public async Task<LLMDto> GetLLMByIdAsync(string id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null) throw new Exception("Invalid token");

            // Get LLM by ID
            var result = await supabase.From<LLM>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Get();

            var llm = result.Models.FirstOrDefault();

            if (llm == null) throw new Exception("LLM not found");

            // Map to DTO
            return new LLMDto
            {
                Id = llm.Id,
                Name = llm.Name,
                Model = llm.Model,
                InferenceConfig = JsonSerializer.Deserialize<InferenceConfig>(llm.InferenceConfigJson) ?? new InferenceConfig()
            };
        }

        public async Task<LLMDto> CreateLLMAsync(CreateLLMDto createLLMDto, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null) throw new Exception("Invalid token");

            // Ensure InferenceConfig is not null
            if (createLLMDto.InferenceConfig == null)
                createLLMDto.InferenceConfig = new InferenceConfig();

            // Create new LLM, associate with user, and insert into database
            var newLLM = new LLM
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id!,
                Name = createLLMDto.Name,
                Model = createLLMDto.Model,
                InferenceConfigJson = JsonSerializer.Serialize(createLLMDto.InferenceConfig)
            };
            var result = await supabase.From<LLM>().Insert(newLLM);
            var createdLLM = result.Models.FirstOrDefault();

            if (createdLLM == null) throw new Exception("Failed to create LLM");

            // Map to DTO
            return new LLMDto
            {
                Id = createdLLM.Id!,
                Name = createdLLM.Name,
                Model = createdLLM.Model,
                InferenceConfig = JsonSerializer.Deserialize<InferenceConfig>(createdLLM.InferenceConfigJson) ?? new InferenceConfig()
            };
        }

        public async Task DeleteLLMAsync(string id, string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null) throw new Exception("Invalid token");

            // Delete LLM by ID, ensuring it belongs to the user
            await supabase.From<LLM>()
                .Where(x => x.UserId == user.Id && x.Id == id)
                .Delete();
        }
    }
}