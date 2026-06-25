using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Supabase.Postgrest.Exceptions;
using Supabase.Gotrue.Exceptions;
using backend.Exceptions;
using System.Text.Json;

namespace backend.Filters;

public class ExceptionFilter : IExceptionFilter
{
    private readonly ILogger _logger;

    public ExceptionFilter(ILogger<ExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        // Handle validation exceptions
        if (context.Exception is ValidationException)
        {
            // Business logic validation errors: input was understood but invalid
            context.Result = new BadRequestObjectResult(new { message = context.Exception.Message });
            context.ExceptionHandled = true;
            return;
        }

        // Handle not found exceptions
        if (context.Exception is NotFoundException)
        {
            // Resource does not exist for this user (e.g., LLM not found)
            context.Result = new NotFoundObjectResult(new { message = context.Exception.Message });
            context.ExceptionHandled = true;
            return;
        }

        // Handle Supabase exceptions (Gotrue and Postgrest)
        if (context.Exception is GotrueException or PostgrestException)
        {
            int statusCode = context.Exception switch
            {
                GotrueException ge => ge.StatusCode,
                PostgrestException pe => pe.StatusCode,
                _ => 0
            };

            var errorMessage = ParseSupabaseError(context.Exception.Message);

            // No response at all, or Supabase-side 5xx
            if (statusCode == 0 || statusCode >= 500)
            {
                _logger.LogError(context.Exception, "Supabase infrastructure error: {Message}", context.Exception.Message);
                context.Result = new ObjectResult(new { message = "A dependent service is unavailable. Please try again shortly." })
                {
                    StatusCode = StatusCodes.Status502BadGateway
                };
            }
            else
            {
                // 4xx from Supabase, client error
                context.Result = new BadRequestObjectResult(new { message = errorMessage });
            }
            context.ExceptionHandled = true;
            return;
        }

        // Handle Unauthorization exceptions
        if (context.Exception is UnauthorizedAccessException)
        {
            // Log warning for security audit trail
            _logger.LogWarning("Unauthorized access attempt: {Message}", context.Exception.Message);
            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized. Please authenticate and try again." });
            context.ExceptionHandled = true;
            return;
        }

        // Handle invalid operation exceptions (business rule violations)
        if (context.Exception is InvalidOperationException)
        {
            context.Result = new BadRequestObjectResult(new { message = context.Exception.Message });
            context.ExceptionHandled = true;
            return;
        }

        // Log and handle any other unhandled exceptions
        _logger.LogError(context.Exception, "An unhandled error occurred: {Message}", context.Exception.Message);
        context.Result = new ObjectResult(new { message = "An unexpected error occurred. Please try again later." })
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };
        context.ExceptionHandled = true;
    }

    private string ParseSupabaseError(string errorJson)
    {
        try
        {
            using var doc = JsonDocument.Parse(errorJson);
            return doc.RootElement.GetProperty("msg").GetString() ?? errorJson;
        }
        catch
        {
            // Fallback to raw JSON if parsing fails
            return errorJson;
        }
    }
}