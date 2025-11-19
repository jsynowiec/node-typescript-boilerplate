import type { ValidationSchema, ValidationResult } from './schemas';
import { Validator } from './validator';

/**
 * Validation middleware configuration
 */
export interface MiddlewareOptions {
  abortEarly?: boolean;
  stripUnknown?: boolean;
  context?: Record<string, unknown>;
}

/**
 * Validation middleware for request/response pipelines
 */
export class ValidationMiddleware {
  private schemas: Map<string, ValidationSchema>;
  private validators: Map<string, Validator>;

  constructor() {
    this.schemas = new Map();
    this.validators = new Map();
  }

  /**
   * Register a validation schema
   */
  registerSchema(name: string, schema: ValidationSchema): void {
    this.schemas.set(name, schema);
    this.validators.set(name, new Validator(schema));
  }

  /**
   * Unregister a schema
   */
  unregisterSchema(name: string): boolean {
    const deleted = this.schemas.delete(name);
    this.validators.delete(name);
    return deleted;
  }

  /**
   * Get registered schema by name
   */
  getSchema(name: string): ValidationSchema | undefined {
    return this.schemas.get(name);
  }

  /**
   * Validate data using named schema
   */
  validateWithSchema(
    schemaName: string,
    data: Record<string, unknown>,
    options?: MiddlewareOptions,
  ): ValidationResult {
    const validator = this.validators.get(schemaName);

    if (!validator) {
      throw new Error(`Schema '${schemaName}' not found`);
    }

    const result = validator.validate(data);

    // Apply options
    if (options?.abortEarly && result.errors.length > 0) {
      result.errors = [result.errors[0]];
    }

    if (options?.stripUnknown && result.sanitized) {
      const schema = this.schemas.get(schemaName);
      if (schema) {
        const allowedFields = new Set(schema.rules.map((r) => r.field));
        result.sanitized = Object.fromEntries(
          Object.entries(result.sanitized).filter(([key]) =>
            allowedFields.has(key),
          ),
        );
      }
    }

    return result;
  }

  /**
   * Create middleware function for request validation
   */
  createMiddleware(
    schemaName: string,
    options?: MiddlewareOptions,
  ): (data: Record<string, unknown>) => ValidationResult {
    return (data: Record<string, unknown>) =>
      this.validateWithSchema(schemaName, data, options);
  }

  /**
   * Batch validate multiple data sets
   */
  batchValidate(
    schemaName: string,
    dataArray: Record<string, unknown>[],
  ): ValidationResult[] {
    const validator = this.validators.get(schemaName);

    if (!validator) {
      throw new Error(`Schema '${schemaName}' not found`);
    }

    return dataArray.map((data) => validator.validate(data));
  }

  /**
   * Check if all validations in batch passed
   */
  batchValidationPassed(results: ValidationResult[]): boolean {
    return results.every((result) => result.valid);
  }

  /**
   * Get all registered schema names
   */
  getSchemaNames(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * Get total count of registered schemas
   */
  getSchemaCount(): number {
    return this.schemas.size;
  }

  /**
   * Clear all schemas
   */
  clearAll(): void {
    this.schemas.clear();
    this.validators.clear();
  }
}

/**
 * Global middleware instance
 */
let globalMiddleware: ValidationMiddleware | null = null;

/**
 * Get or create global middleware instance
 */
export function getGlobalMiddleware(): ValidationMiddleware {
  if (!globalMiddleware) {
    globalMiddleware = new ValidationMiddleware();
  }
  return globalMiddleware;
}

/**
 * Reset global middleware instance
 */
export function resetGlobalMiddleware(): void {
  globalMiddleware = null;
}
