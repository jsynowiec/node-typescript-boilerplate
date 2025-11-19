/**
 * Schema validation types and interfaces
 */

export enum ValidationLevel {
  Strict = 'strict',
  Moderate = 'moderate',
  Lenient = 'lenient',
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'email' | 'url';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: unknown) => boolean;
  errorMessage?: string;
}

export interface ValidationSchema {
  name: string;
  level: ValidationLevel;
  rules: ValidationRule[];
  allowUnknownFields?: boolean;
}

export interface ValidationError {
  field: string;
  value: unknown;
  message: string;
  rule: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  sanitized?: Record<string, unknown>;
}

/**
 * Schema builder for fluent API
 */
export class SchemaBuilder {
  private schema: ValidationSchema;

  constructor(name: string, level: ValidationLevel = ValidationLevel.Moderate) {
    this.schema = {
      name,
      level,
      rules: [],
      allowUnknownFields: false,
    };
  }

  addRule(rule: ValidationRule): this {
    this.schema.rules.push(rule);
    return this;
  }

  stringField(
    field: string,
    required: boolean = true,
    options?: {
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      errorMessage?: string;
    },
  ): this {
    this.schema.rules.push({
      field,
      type: 'string',
      required,
      ...options,
    });
    return this;
  }

  numberField(
    field: string,
    required: boolean = true,
    options?: {
      min?: number;
      max?: number;
      errorMessage?: string;
    },
  ): this {
    this.schema.rules.push({
      field,
      type: 'number',
      required,
      ...options,
    });
    return this;
  }

  emailField(
    field: string,
    required: boolean = true,
    errorMessage?: string,
  ): this {
    this.schema.rules.push({
      field,
      type: 'email',
      required,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: errorMessage || 'Invalid email format',
    });
    return this;
  }

  urlField(
    field: string,
    required: boolean = true,
    errorMessage?: string,
  ): this {
    this.schema.rules.push({
      field,
      type: 'url',
      required,
      errorMessage: errorMessage || 'Invalid URL format',
    });
    return this;
  }

  booleanField(field: string, required: boolean = true): this {
    this.schema.rules.push({
      field,
      type: 'boolean',
      required,
    });
    return this;
  }

  arrayField(field: string, required: boolean = true): this {
    this.schema.rules.push({
      field,
      type: 'array',
      required,
    });
    return this;
  }

  objectField(field: string, required: boolean = true): this {
    this.schema.rules.push({
      field,
      type: 'object',
      required,
    });
    return this;
  }

  allowUnknown(allow: boolean = true): this {
    this.schema.allowUnknownFields = allow;
    return this;
  }

  setLevel(level: ValidationLevel): this {
    this.schema.level = level;
    return this;
  }

  build(): ValidationSchema {
    return { ...this.schema };
  }
}
