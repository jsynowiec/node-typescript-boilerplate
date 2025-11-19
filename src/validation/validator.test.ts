import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ValidationSchema } from '../src/validation/schemas.js';

vi.mock('../src/validation/schemas.js', (): Record<string, unknown> => ({
  ValidationLevel: {
    Strict: 'Strict',
    Lax: 'Lax',
  },
}));

import { Validator, validateData } from '../src/validation/validator.js';
import { ValidationLevel } from '../src/validation/schemas.js';

describe('Validator', (): void => {
  let schema: ValidationSchema;
  let validator: Validator;

  beforeEach((): void => {
    schema = {
      level: ValidationLevel.Strict,
      allowUnknownFields: false,
      rules: [
        { field: 'name', type: 'string', required: true, minLength: 2, maxLength: 10 },
        { field: 'age', type: 'number', min: 0, max: 120 },
        { field: 'email', type: 'email' },
        { field: 'website', type: 'url' },
        { field: 'tags', type: 'array' },
        { field: 'prefs', type: 'object' },
        { field: 'code', type: 'string', pattern: /^[A-Z]{3}-\d{3}$/ },
        {
          field: 'isEven',
          type: 'number',
          customValidator: (value: unknown): boolean =>
            typeof value === 'number' && value % 2 === 0,
        },
        {
          field: 'willThrow',
          type: 'string',
          customValidator: (_v: unknown): boolean => {
            throw new Error('boom');
          },
        },
      ],
    };
    validator = new Validator(schema);
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  describe('constructor', (): void => {
    test('should initialize with provided schema', (): void => {
      expect(validator).toBeInstanceOf(Validator);
      expect(validator.getLevel()).toBe(ValidationLevel.Strict);
      expect(validator.getSchema().allowUnknownFields).toBe(false);
    });
  });

  describe('validate', (): void => {
    test('should validate and sanitize valid data', (): void => {
      const data: Record<string, unknown> = {
        name: '  Alice  ',
        age: 30,
        email: 'alice@example.com',
        website: 'https://example.com',
        tags: ['a', 'b'],
        prefs: { theme: 'dark' },
        code: 'ABC-123',
        isEven: 2,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.sanitized).toBeDefined();
      expect(result.sanitized).toMatchObject({
        name: 'Alice',
        age: 30,
        email: 'alice@example.com',
        website: 'https://example.com',
        tags: ['a', 'b'],
        prefs: { theme: 'dark' },
        code: 'ABC-123',
        isEven: 2,
      });
    });

    test('should report required field missing', (): void => {
      const data: Record<string, unknown> = {
        age: 25,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'required' && e.field === 'name')).toBe(true);
      expect(result.sanitized).toBeUndefined();
    });

    test('should validate type and report mismatches for number', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        age: '30', // string should fail type check
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'type' && e.field === 'age')).toBe(true);
    });

    test('should enforce string minLength constraint', (): void => {
      const data: Record<string, unknown> = {
        name: 'A',
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'minLength' && e.field === 'name')).toBe(true);
    });

    test('should enforce string maxLength constraint', (): void => {
      const data: Record<string, unknown> = {
        name: 'ThisNameIsTooLong',
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'maxLength' && e.field === 'name')).toBe(true);
    });

    test('should enforce numeric min constraint', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        age: -1,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'min' && e.field === 'age')).toBe(true);
    });

    test('should enforce numeric max constraint', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        age: 121,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'max' && e.field === 'age')).toBe(true);
    });

    test('should validate regex pattern mismatch', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        code: 'abc-123',
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'pattern' && e.field === 'code')).toBe(true);
    });

    test('should validate email type', (): void => {
      const ok = validator.validate({ name: 'Ok', email: 'user@host.tld' });
      const bad = validator.validate({ name: 'Ok', email: 'not-an-email' });

      expect(ok.valid).toBe(true);
      expect(bad.valid).toBe(false);
      expect(bad.errors.some((e) => e.rule === 'type' && e.field === 'email')).toBe(true);
    });

    test('should validate url type', (): void => {
      const ok = validator.validate({ name: 'Ok', website: 'https://domain.test/path?q=1' });
      const bad = validator.validate({ name: 'Ok', website: 'ht!tp:/bad' });

      expect(ok.valid).toBe(true);
      expect(bad.valid).toBe(false);
      expect(bad.errors.some((e) => e.rule === 'type' && e.field === 'website')).toBe(true);
    });

    test('should handle custom validator returning false', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        isEven: 3,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'custom' && e.field === 'isEven')).toBe(true);
    });

    test('should handle custom validator throwing error (catch path)', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        willThrow: 'x',
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      const err = result.errors.find((e) => e.field === 'willThrow');
      expect(err?.rule).toBe('custom_error');
      expect(String(err?.message)).toContain('boom');
    });

    test('should flag unknown fields as error in strict mode', (): void => {
      const data: Record<string, unknown> = {
        name: 'Bob',
        extra: 1,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.rule === 'unknown_field' && e.field === 'extra')).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    test('should warn on unknown fields in non-strict mode', (): void => {
      validator.setLevel(ValidationLevel.Lax);
      const data: Record<string, unknown> = {
        name: 'Bob',
        extra: 1,
      };

      const result = validator.validate(data);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings.some((w) => w.includes("Unknown field 'extra'"))).toBe(true);
    });

    test('should respect allowUnknownFields=true and not report unknowns', (): void => {
      const schema2: ValidationSchema = {
        ...schema,
        allowUnknownFields: true,
      };
      const localValidator = new Validator(schema2);
      const data: Record<string, unknown> = { name: 'Bob', extra: 1 };

      const result = localValidator.validate(data);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    test('should only return sanitized when no errors', (): void => {
      // Error case: unknown field causes error in strict mode
      const withError = validator.validate({ name: 'Bob', extra: 'x' });
      expect(withError.valid).toBe(false);
      expect(withError.sanitized).toBeUndefined();

      // Success case: sanitized is populated and trimmed
      const ok = validator.validate({ name: '  Bob  ' });
      expect(ok.valid).toBe(true);
      expect(ok.sanitized).toBeDefined();
      expect(ok.sanitized?.name).toBe('Bob');
      // Only defined rule fields present in data are included
      expect(Object.keys(ok.sanitized as Record<string, unknown>)).toEqual(['name']);
    });
  });

  describe('getSchema', (): void => {
    test('should return a shallow copy (not the same reference)', (): void => {
      const copy = validator.getSchema();
      expect(copy).not.toBe(schema);
      // Mutating copy.level should not affect validator internal level
      copy.level = ValidationLevel.Lax;
      expect(validator.getLevel()).toBe(ValidationLevel.Strict);
    });
  });

  describe('getLevel', (): void => {
    test('should return current level', (): void => {
      expect(validator.getLevel()).toBe(ValidationLevel.Strict);
    });
  });

  describe('setLevel', (): void => {
    test('should update validation level', (): void => {
      validator.setLevel(ValidationLevel.Lax);
      expect(validator.getLevel()).toBe(ValidationLevel.Lax);
    });
  });
});

describe('validateData helper', (): void => {
  let schema: ValidationSchema;

  beforeEach((): void => {
    schema = {
      level: ValidationLevel.Strict,
      allowUnknownFields: false,
      rules: [
        { field: 'name', type: 'string', required: true, minLength: 2 },
        { field: 'email', type: 'email' },
      ],
    };
  });

  test('should validate data equivalently to Validator instance', (): void => {
    const data: Record<string, unknown> = { name: 'Jane', email: 'jane@host.tld' };

    const instanceResult = new Validator(schema).validate(data);
    const helperResult = validateData(data, schema);

    expect(helperResult.valid).toBe(instanceResult.valid);
    expect(helperResult.errors).toEqual(instanceResult.errors);
    expect(helperResult.sanitized).toEqual(instanceResult.sanitized);
  });

  test('should return same errors for invalid data', (): void => {
    const data: Record<string, unknown> = { name: 'J', email: 'bad-email' };

    const instanceResult = new Validator(schema).validate(data);
    const helperResult = validateData(data, schema);

    expect(helperResult.valid).toBe(false);
    expect(helperResult.errors.length).toBe(instanceResult.errors.length);
    // Compare rule types to ensure structure is consistent
    expect(helperResult.errors.map((e) => e.rule)).toEqual(
      instanceResult.errors.map((e) => e.rule),
    );
  });
});
