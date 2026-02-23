namespace backend.Helpers
{
    public static class SupabaseHelper
    {
        // Creates and initializes a Supabase client using environment variables.
        // A new client is created per call: no singleton, so no shared session state between requests.
        public static async Task<Supabase.Client> GetClientAsync()
        {
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");

            if (string.IsNullOrEmpty(url) || string.IsNullOrEmpty(key))
                throw new InvalidOperationException("SUPABASE_URL and SUPABASE_KEY must be set");

            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = false // Realtime not needed, skipping the connection overhead
            };

            var supabase = new Supabase.Client(url, key, options);
            await supabase.InitializeAsync();

            return supabase;
        }
    }
}