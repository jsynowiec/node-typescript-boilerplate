import type {
  ValidationSchema,
  ValidationRule,
  ValidationResult,
  ValidationError,
} from './schemas.js';
import { ValidationLevel } from './schemas.js';

/**
 * Advanced validator with sanitization and transformation capabilities
 */
export class Validator {
  private schema: ValidationSchema;
  private errors: ValidationError[];
  private warnings: string[];

  constructor(schema: ValidationSchema) {
    this.schema = schema;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate data against schema
   */
  validate(data: Record<string, unknown>): ValidationResult {
    this.errors = [];
    this.warnings = [];

    const sanitized: Record<string, unknown> = {};

    // Validate each rule
    for (const rule of this.schema.rules) {
      const value = data[rule.field];

      if (value === undefined || value === null) {
        if (rule.required) {
          this.errors.push({
            field: rule.field,
            value,
            message: rule.errorMessage || `Field '${rule.field}' is required`,
            rule: 'required',
          });
        }
        continue;
      }

      // Type validation
      if (!this.validateType(value, rule)) {
        this.errors.push({
          field: rule.field,
          value,
          message:
            rule.errorMessage ||
            `Field '${rule.field}' must be of type ${rule.type}`,
          rule: 'type',
        });
        continue;
      }

      // Length validation for strings
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          this.errors.push({
            field: rule.field,
            value,
            message: `Field '${rule.field}' must be at least ${rule.minLength} characters`,
            rule: 'minLength',
          });
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          this.errors.push({
            field: rule.field,
            value,
            message: `Field '${rule.field}' must not exceed ${rule.maxLength} characters`,
            rule: 'maxLength',
          });
        }
      }

      // Range validation for numbers
      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          this.errors.push({
            field: rule.field,
            value,
            message: `Field '${rule.field}' must be at least ${rule.min}`,
            rule: 'min',
          });
        }

        if (rule.max !== undefined && value > rule.max) {
          this.errors.push({
            field: rule.field,
            value,
            message: `Field '${rule.field}' must not exceed ${rule.max}`,
            rule: 'max',
          });
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          this.errors.push({
            field: rule.field,
            value,
            message:
              rule.errorMessage ||
              `Field '${rule.field}' does not match required pattern`,
            rule: 'pattern',
          });
        }
      }

      // Custom validator
      if (rule.customValidator) {
        try {
          if (!rule.customValidator(value)) {
            this.errors.push({
              field: rule.field,
              value,
              message:
                rule.errorMessage ||
                `Field '${rule.field}' failed custom validation`,
              rule: 'custom',
            });
          }
        } catch (error) {
          this.errors.push({
            field: rule.field,
            value,
            message: `Custom validator threw error: ${(error as Error).message}`,
            rule: 'custom_error',
          });
        }
      }

      // Add to sanitized data
      sanitized[rule.field] = this.sanitizeValue(value, rule);
    }

    // Check for unknown fields
    if (!this.schema.allowUnknownFields) {
      const definedFields = new Set(this.schema.rules.map((r) => r.field));
      for (const key of Object.keys(data)) {
        if (!definedFields.has(key)) {
          if (this.schema.level === ValidationLevel.Strict) {
            this.errors.push({
              field: key,
              value: data[key],
              message: `Unknown field '${key}' is not allowed`,
              rule: 'unknown_field',
            });
          } else {
            this.warnings.push(`Unknown field '${key}' found in data`);
          }
        }
      }
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      sanitized: this.errors.length === 0 ? sanitized : undefined,
    };
  }

  /**
   * Validate type of value
   */
  private validateType(value: unknown, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return (
          typeof value === 'object' && value !== null && !Array.isArray(value)
        );
      case 'email':
        return (
          typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        );
      case 'url':
        return typeof value === 'string' && this.isValidUrl(value);
      default:
        return false;
    }
  }

  /**
   * Check if string is valid URL
   */
  private isValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize value based on type
   */
  private sanitizeValue(value: unknown, rule: ValidationRule): unknown {
    if (rule.type === 'string' && typeof value === 'string') {
      // Trim strings
      return value.trim();
    }

    if (rule.type === 'number' && typeof value === 'string') {
      // Try to convert string to number
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return num;
      }
    }

    return value;
  }

  /**
   * Get current schema
   */
  getSchema(): ValidationSchema {
    return { ...this.schema };
  }

  /**
   * Get validation level
   */
  getLevel(): ValidationLevel {
    return this.schema.level;
  }

  /**
   * Update validation level
   */
  setLevel(level: ValidationLevel): void {
    this.schema.level = level;
  }
}

/**
 * Quick validation helper function
 */
export function validateData(
  data: Record<string, unknown>,
  schema: ValidationSchema,
): ValidationResult {
  const validator = new Validator(schema);
  return validator.validate(data);
}
