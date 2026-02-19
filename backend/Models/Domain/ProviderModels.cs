namespace backend.Models.Domain
{
    public static class ProviderModels
    {
        public static readonly Dictionary<LLMProvider, string[]> Available = new()
        {
            [LLMProvider.Ollama] = [
                "llama3.2",
                "mistral",
                "deepseek-r1",
                "phi4"
            ],
        };
    }
}