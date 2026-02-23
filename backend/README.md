# AkseLLM Backend

Backend service for AkseLLM, a web application for managing and interacting with Large Language Models (LLMs). Built with ASP.NET Core, Supabase, and Postgrest.

## Architecture Overview

### Authentication & Authorization
- **Provider**: Supabase (GoTrue)
- **Token storage**: HttpOnly, Secure cookies (prevents XSS; enforces HTTPS)
- **Session management**: JWT tokens (access + refresh) extracted by `CookieHelper`
- **Cookie properties**: `HttpOnly=true`, `Secure=true`, `SameSite=Strict`

### Database
- **Provider**: Supabase PostgreSQL via Postgrest
- **Authentication**: Service key from environment (`SUPABASE_KEY`)
- **Tables**: `llms` (user LLM configurations), `users` (via Supabase Auth)
- **Access control**: All queries filtered by `user_id` to enforce per-user isolation

### Error Handling
- **Filter**: Global `ExceptionFilter` maps exceptions to HTTP responses
- **Exception types**:
  - `ValidationException` → 400 Bad Request
  - `NotFoundException` → 404 Not Found
  - `UnauthorizedAccessException` → 401 Unauthorized
  - Supabase exceptions (`GotrueException`, `PostgrestException`) → 400 Bad Request
  - Other exceptions → 500 Internal Server Error

### API Structure

#### Controllers
- **AuthController** (`/api/auth`)
  - `POST /register`: Register new user (sets auth cookies)
  - `POST /login`: Login user (sets auth cookies)
  - `GET /me`: Get current user profile (requires auth)
  - `POST /logout`: Logout user (clears cookies)

- **LLMController** (`/api/llm`)
  - `GET /`: List all LLMs for authenticated user
  - `GET /{id}`: Get single LLM by ID (user-scoped)
  - `POST /`: Create new LLM
  - `PUT /`: Update existing LLM
  - `DELETE /{id}`: Delete LLM

#### Request/Response Models
- **DTOs** (Data Transfer Objects): Located in `Models/DTOs/`
  - `Auth/`: RegisterDto, LoginDto, AuthResponseDto
  - `LLM/`: CreateLLMDto, UpdateLLMDto, LLMResponseDto
  
- **Domain Models**: Located in `Models/Domain/`
  - `LLMEntity`: Database entity for LLMs
  - Corresponds to `llms` table in Supabase

- **Common Models**: Located in `Models/Common/`
  - `LLM`: LLM configuration model
  - `LLMConfig`: Configuration object (provider, model, temperatures, penalties, etc.)
  - `LLMProvider`: Enum of supported providers (currently `Ollama`)
  - `Message`: Chat message (role, content, created_at)
  - `UserProfile`: User profile information

### Core Services

#### AuthService
- Handles user registration and login via Supabase GoTrue
- Sets user metadata (display_name, plan) during signup
- Returns JWT tokens and user profile
- Throws `ValidationException` on auth failures
- Method: `RegisterAsync`, `LoginAsync`, `LogoutAsync`, `GetCurrentUserAsync`

#### LLMService
- CRUD operations for LLM configurations
- Queries scoped to authenticated user via `user.Id`
- Deserializes `LLMConfig` and `ChatHistory` from JSON stored in DB
- Throws `NotFoundException` if LLM not found or doesn't belong to user
- Throws `UnauthorizedAccessException` if session is invalid
- Methods: `GetAllLLMsAsync`, `GetLLMByIdAsync`, `CreateLLMAsync`, `UpdateLLMAsync`, `DeleteLLMAsync`

### Helpers

#### SupabaseHelper
- Initializes and returns Supabase client
- Reads `SUPABASE_URL` and `SUPABASE_KEY` from environment
- Throws `InvalidOperationException` if environment variables missing
- Disables Realtime by default

#### CookieHelper
- Extracts JWT tokens from request cookies
- Returns tuple of (token, refreshToken)
- Throws `UnauthorizedAccessException` if cookies missing (mapped to 401)

### Validation

#### ValidModelForProviderAttribute
- Custom validation attribute for `LLMConfig.Model` field
- Ensures the model name is valid for the selected provider
- Integrated with ASP.NET Core model validation pipeline
- Applied to: `CreateLLMDto`, `UpdateLLMDto`

## Configuration

### Environment Variables
Required for local and production deployment:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-api-key-here
```

### .env File
Create `.env` in project root (loaded via `DotNetEnv.Env.Load()` in `Program.cs`):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-api-key-here
```

### CORS Configuration
- **Allowed Origin**: `https://localhost:5173` (frontend dev server)
- **Credentials**: Enabled (allows cookies)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Any

## Development Setup

### Prerequisites
- .NET 10.0 (or compatible runtime)
- Supabase project (for auth and database)

### Running Locally

1. **Install dependencies**:
   ```bash
   dotnet restore
   ```

2. **Configure environment** (create `.env` file with Supabase credentials)

3. **Run the server**:
   ```bash
   dotnet run
   ```
   
   Server starts on `https://localhost:7001` by default.

4. **Test endpoints**:
   - Use `backend.http` (REST client file) or Postman
   - Register user: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Cookies are set automatically by the server — use a tool that supports cookie jars (e.g. Postman, or curl with `--cookie-jar`)

### OpenAPI / Swagger
- Available in development mode at `/openapi/v1.json`
- Use Swagger UI or other tools to explore API

## Data Models

### LLMEntity (Database Table: `llms`)
```
id: int (PK)
user_id: string (FK to Supabase auth.users)
name: string
llm_config: string (JSON)
chat_history: string (JSON array of Messages)
created_at: datetime
```

### LLMConfig (JSON structure)
```json
{
  "provider": "Ollama",
  "model": "llama2:latest",
  "temperature": 0.7,
  "maxTokens": 200,
  "systemPrompt": "You are helpful.",
  "topP": 0.9,
  "topK": 40,
  "frequencyPenalty": null,
  "presencePenalty": null,
  "repeatPenalty": null,
  "seed": null,
  "stream": true,
  "stopSequences": null
}
```

### Message (Chat history item)
```
role: string ("user" | "assistant" | "system")
content: string
createdAt: datetime
```

## Testing

### Minimal Test Flow
1. Register a user:
   ```bash
   curl -c cookies.txt -X POST https://localhost:7001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test1234!","username":"testuser"}'
   ```

2. Use the saved cookie jar for authenticated requests:
   ```bash
   curl -b cookies.txt -X GET https://localhost:7001/api/auth/me
   ```

3. Create an LLM:
   ```bash
   curl -b cookies.txt -X POST https://localhost:7001/api/llm \
     -H "Content-Type: application/json" \
     -d '{"name":"My LLM","config":{"provider":"Ollama","model":"llama2:latest"}}'
   ```

## Common Issues

### Cookies Not Set
- Ensure frontend is using `https://localhost:5173` (not `http://`)
- Verify `Secure=true` on cookies matches HTTPS environment
- Check `SameSite=Strict` is compatible with frontend domain

### 401 Unauthorized
- Verify cookies are being sent with requests (`credentials: "include"` in fetch)
- Tokens may be expired; re-login required

### 404 Not Found
- Verify LLM ID exists and belongs to authenticated user
- Check URL path is correct (e.g., `/api/llm/123` not `/api/llm/id/123`)

### 500 Internal Server Error
- Check logs for detailed exception
- Verify Supabase connection (SUPABASE_URL, SUPABASE_KEY correct)
- Ensure .env file exists and is loaded

## Security Considerations

1. **Tokens in Cookies**: HttpOnly prevents JavaScript access; Secure enforces HTTPS
2. **User Isolation**: All queries include `WHERE user_id = <current_user>`
3. **CSRF Protection**: SameSite=Strict prevents cross-site cookie sending
4. **HTTPS Required**: Production must use HTTPS; cookies will not function over HTTP
5. **Validation**: Custom `ValidModelForProviderAttribute` validates model names per provider
6. **Logging**: Errors logged but sensitive data (tokens, passwords) should not appear in logs

## Future Improvements

- Add rate limiting to prevent brute-force attacks
- Implement token refresh logic (currently relies on Supabase)
- Add admin endpoints for user management
- Support additional LLM providers (currently Ollama only)
- Add integration tests for auth and LLM workflows
- Consider implementing refresh token rotation

## File Structure

```
backend/
├── Controllers/
│   ├── AuthController.cs
│   └── LLMController.cs
├── Services/
│   ├── AuthService.cs
│   ├── LLMService.cs
│   └── Interfaces (IAuthService, ILLMService)
├── Models/
│   ├── Common/
│   │   ├── LLM.cs
│   │   ├── LLMConfig.cs
│   │   ├── LLMProvider.cs
│   │   ├── Message.cs
│   │   ├── UserProfile.cs
│   │   └── ProviderModels.cs
│   ├── Domain/
│   │   └── LLMEntity.cs
│   └── DTOs/
│       ├── Auth/
│       └── LLM/
├── Helpers/
│   ├── SupabaseHelper.cs
│   └── CookieHelper.cs
├── Filters/
│   └── ExceptionFilter.cs
├── Validation/
│   └── ValidModelForProviderAttribute.cs
├── Properties/
│   └── launchSettings.json
├── Program.cs
├── backend.csproj
├── appsettings.json
├── appsettings.Development.json
├── backend.http
└── README.md
```

## Contributing

1. Follow existing code style and naming conventions
2. Add comments to complex logic (especially async/await and JSON serialization)
3. Update this README if adding new endpoints or models
4. Test auth flows and user isolation thoroughly

## License

See LICENSE file in project root.