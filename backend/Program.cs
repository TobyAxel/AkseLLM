using backend.Filters;
using backend.Services;
using DotNetEnv;
using System.Text.Json.Serialization;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
const string corsPolicy = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(builder.Configuration["AllowedOrigins"]!.Split(","))
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure controllers with filters
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILLMService, LLMService>();

// Configure OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(corsPolicy);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();