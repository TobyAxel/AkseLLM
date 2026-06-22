using System.ComponentModel.DataAnnotations;
using backend.Models.Common;

namespace backend.Validation
{
    // Custom validation attribute that ensures the selected model is valid for the chosen provider.
    // Applied to the Model property on LLMConfig, so it has access to the full config object via validationContext.
    public class ValidModelForProviderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var config = validationContext.ObjectInstance as LLMConfig;

            if (config == null) throw new ValidationException("Selected model is not valid for the chosen LLM provider.");

            // Look up the list of valid models for this provider
            if (!ProviderModels.Available.TryGetValue(config.Provider, out var models))
                return new ValidationResult($"Unknown provider: {config.Provider}");

            // Check the selected model exists in that provider's list
            if (!models.Contains(config.Model))
            {
                return new ValidationResult(
                    $"Provider {config.Provider} has no Model named {config.Model}. " +
                    $"Available models: {string.Join(", ", models)}");
            }

            return ValidationResult.Success;
        }
    }
}