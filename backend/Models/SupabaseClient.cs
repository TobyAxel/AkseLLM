namespace backend.Models 
{
    public class SupabaseClient 
    {
        private readonly Supabase.Client _supabase;

        public SupabaseClient()
        {
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");

            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true
            };

            _supabase = new Supabase.Client(url, key, options);
        }

        public async Task InitializeAsync()
        {
            await _supabase.InitializeAsync();
        }

        public Supabase.Client GetClient()
        {
            return _supabase;
        }
    }
}