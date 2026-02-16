namespace backend.Helpers
{
    public static class HandleApiKeyHelper
    {
        public static async Task<string?> HandleApiKey(string apiKey)
        {
            if (string.IsNullOrEmpty(apiKey) || !apiKey.StartsWith("Bearer "))
            {
                return null;
            }

            string token = apiKey.Substring("Bearer ".Length).Trim();
            return token;
        }
    }
}