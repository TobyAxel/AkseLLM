using System.ComponentModel.DataAnnotations;
using backend.Models.Common;

namespace backend.Validation
{
    public class ValidModelForProviderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var config = validationContext.ObjectInstance as LLMConfig;
            if (config is null)
                return new ValidationResult("Validation context did not contain a valid LLMConfig instance.");
            
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