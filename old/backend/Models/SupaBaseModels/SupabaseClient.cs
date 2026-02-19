namespace backend.Models.SupaBaseModels
{
    public static class SupabaseClient
    {
        private static Supabase.Client? _instance;
        
        public static async Task<Supabase.Client> GetInstanceAsync()
        {
            if (_instance != null)
                return _instance;
                
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
            
            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true,
            };
            
            _instance = new Supabase.Client(url!, key!, options);
            await _instance.InitializeAsync();
            
            return _instance;
        }
    }
}