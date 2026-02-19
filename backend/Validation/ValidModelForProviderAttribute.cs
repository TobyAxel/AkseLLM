using System.ComponentModel.DataAnnotations;
using backend.Models.Domain;

namespace backend.Validation
{
    public class ValidModelForProviderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var config = (LLMConfig)validationContext.ObjectInstance;

            if (!ProviderModels.Available.TryGetValue(config.Provider, out var models))
            {
                return new ValidationResult($"Unknown provider: {config.Provider}");
            }

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