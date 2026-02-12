using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Supabase.Postgrest.Exceptions;
using Supabase.Gotrue.Exceptions;
using System.Text.Json;

namespace backend.Filters;

public class ExceptionFilter : IExceptionFilter
{
    private readonly ILogger<ExceptionFilter> _logger;

    public ExceptionFilter(ILogger<ExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        // Handle validation exceptions
        if (context.Exception is Exceptions.ValidationException)
        {
            context.Result = new BadRequestObjectResult(new { message = context.Exception.Message });
            context.ExceptionHandled = true;
            return;
        }

        // Handle Supabase exceptions (Gotrue and Postgrest)
        if (context.Exception is GotrueException or PostgrestException)
        {
            var errorMessage = ParseSupabaseError(context.Exception.Message);
            context.Result = new BadRequestObjectResult(new { message = errorMessage });
            context.ExceptionHandled = true;
            return;
        }

        // Log and handle any other unhandled exceptions
        _logger.LogError(context.Exception, "An error occurred: {Message}", context.Exception.Message);

        var message = context.Exception.Message;
        context.Result = new BadRequestObjectResult(new { message });
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
            return errorJson;
        }
    }
}