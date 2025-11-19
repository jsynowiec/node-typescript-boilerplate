import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Ambient type declarations for modules used only for types
declare module './schemas.js' {
  export interface ValidationRule {
    field: string;
  }
  export interface ValidationSchema {
    rules: ValidationRule[];
  }
  export interface ValidationError {
    field?: string;
    message: string;
  }
  export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    sanitized?: Record<string, unknown>;
  }
}

declare module './validator.js' {
  import type { ValidationResult } from './schemas.js';
  export class Validator {
    // Runtime is mocked; this typing is for TS only
    validate(_data: Record<string, unknown>): ValidationResult;
  }
  // Helper array exported by the mock to access instances
  export const __mockedInstances: Array<{
    validate: (data: Record<string, unknown>) => ValidationResult;
  }>;
}

// Mock the Validator dependency before importing the SUT
vi.mock('./validator.js', (): Record<string, unknown> => {
  const instances: Array<{ validate: ReturnType<typeof vi.fn> }> = [];

  const Validator = vi.fn().mockImplementation((_schema: unknown) => {
    const instance = {
      validate: vi.fn(),
    };
    instances.push(instance);
    return instance;
  });

  return {
    Validator,
    __mockedInstances: instances,
  };
});

import type { ValidationSchema, ValidationResult } from './schemas.js';
import { __mockedInstances as mockedValidatorInstances } from './validator.js';
import { ValidationMiddleware, getGlobalMiddleware, resetGlobalMiddleware } from './middleware.ts';

describe('ValidationMiddleware', (): void => {
  let middleware: ValidationMiddleware;

  beforeEach((): void => {
    vi.clearAllMocks();
    mockedValidatorInstances.length = 0;
    middleware = new ValidationMiddleware();
  });

  afterEach((): void => {
    resetGlobalMiddleware();
  });

  describe('constructor', (): void => {
    test('should initialize internal maps empty', (): void => {
      expect(middleware).toBeInstanceOf(ValidationMiddleware);
      expect(middleware.getSchemaCount()).toBe(0);
      expect(middleware.getSchemaNames()).toEqual([]);
    });
  });

  describe('registerSchema', (): void => {
    test('should register schema and create a validator instance', (): void => {
      const schema: ValidationSchema = {
        rules: [{ field: 'id' }, { field: 'name' }],
      };

      middleware.registerSchema('user', schema);

      expect(middleware.getSchemaCount()).toBe(1);
      expect(middleware.getSchema('user')).toBe(schema);
      expect(middleware.getSchemaNames()).toEqual(['user']);
      expect(mockedValidatorInstances.length).toBe(1);
    });

    test('should overwrite existing schema with same name', (): void => {
      const schema1: ValidationSchema = { rules: [{ field: 'id' }] };
      const schema2: ValidationSchema = { rules: [{ field: 'email' }] };

      middleware.registerSchema('user', schema1);
      middleware.registerSchema('user', schema2);

      expect(middleware.getSchemaCount()).toBe(1);
      expect(middleware.getSchema('user')).toBe(schema2);
      expect(mockedValidatorInstances.length).toBe(2);
    });
  });

  describe('unregisterSchema', (): void => {
    test('should unregister existing schema and its validator', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'id' }] };
      middleware.registerSchema('user', schema);

      const deleted: boolean = middleware.unregisterSchema('user');

      expect(deleted).toBe(true);
      expect(middleware.getSchema('user')).toBeUndefined();
      expect(middleware.getSchemaCount()).toBe(0);
      expect(() => middleware.validateWithSchema('user', {})).toThrowError(
        "Schema 'user' not found",
      );
    });

    test('should return false when unregistering non-existing schema', (): void => {
      const deleted: boolean = middleware.unregisterSchema('missing');
      expect(deleted).toBe(false);
      expect(middleware.getSchemaCount()).toBe(0);
    });
  });

  describe('getSchema', (): void => {
    test('should return undefined for unknown schema', (): void => {
      expect(middleware.getSchema('unknown')).toBeUndefined();
    });
  });

  describe('validateWithSchema', (): void => {
    test('should throw when schema not found', (): void => {
      expect(() => middleware.validateWithSchema('not-registered', {})).toThrowError(
        "Schema 'not-registered' not found",
      );
    });

    test('should call validator and return its result', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'id' }] };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      const expected: ValidationResult = {
        valid: true,
        errors: [],
        sanitized: { id: 1 },
      };
      instance.validate.mockReturnValueOnce(expected);

      const result: ValidationResult = middleware.validateWithSchema('user', { id: 1 });

      expect(instance.validate).toHaveBeenCalledTimes(1);
      expect(instance.validate).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(expected);
    });

    test('should apply abortEarly option to keep only first error', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'name' }] };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      const fullResult: ValidationResult = {
        valid: false,
        errors: [
          { field: 'name', message: 'required' },
          { field: 'name', message: 'must be string' },
        ],
        sanitized: {},
      };
      instance.validate.mockReturnValueOnce({ ...fullResult });

      const result: ValidationResult = middleware.validateWithSchema(
        'user',
        { name: 123 as unknown as string },
        { abortEarly: true },
      );

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({ field: 'name', message: 'required' });
    });

    test('should not modify errors if abortEarly set but no errors present', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'name' }] };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      const ok: ValidationResult = { valid: true, errors: [], sanitized: { name: 'A' } };
      instance.validate.mockReturnValueOnce({ ...ok });

      const result: ValidationResult = middleware.validateWithSchema(
        'user',
        { name: 'A' },
        { abortEarly: true },
      );

      expect(result.errors).toEqual([]);
    });

    test('should strip unknown fields when stripUnknown is true', (): void => {
      const schema: ValidationSchema = {
        rules: [{ field: 'id' }, { field: 'name' }],
      };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      instance.validate.mockReturnValueOnce({
        valid: true,
        errors: [],
        sanitized: { id: 1, name: 'A', extra: 'x', other: 123 },
      });

      const result: ValidationResult = middleware.validateWithSchema(
        'user',
        { id: 1, name: 'A', extra: 'x', other: 123 },
        { stripUnknown: true },
      );

      expect(result.sanitized).toEqual({ id: 1, name: 'A' });
    });

    test('should not fail when stripUnknown is true but sanitized is undefined', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'id' }] };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      instance.validate.mockReturnValueOnce({
        valid: false,
        errors: [{ field: 'id', message: 'invalid' }],
        sanitized: undefined,
      });

      const result: ValidationResult = middleware.validateWithSchema(
        'user',
        { id: 'oops' as unknown as number },
        { stripUnknown: true },
      );

      expect(result.sanitized).toBeUndefined();
      expect(result.errors).toEqual([{ field: 'id', message: 'invalid' }]);
    });

    test('should apply both abortEarly and stripUnknown together', (): void => {
      const schema: ValidationSchema = {
        rules: [{ field: 'id' }, { field: 'name' }],
      };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      instance.validate.mockReturnValueOnce({
        valid: false,
        errors: [
          { field: 'name', message: 'required' },
          { field: 'id', message: 'must be number' },
        ],
        sanitized: { id: 'x' as unknown as number, name: '', unknown: true },
      });

      const result: ValidationResult = middleware.validateWithSchema(
        'user',
        { id: 'x', name: '', unknown: true },
        { abortEarly: true, stripUnknown: true },
      );

      expect(result.errors).toHaveLength(1);
      expect(result.sanitized).toEqual({ id: 'x' as unknown as number, name: '' });
    });
  });

  describe('createMiddleware', (): void => {
    test('should return a function that validates using provided schema and options', (): void => {
      const schema: ValidationSchema = {
        rules: [{ field: 'id' }, { field: 'name' }],
      };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      instance.validate.mockReturnValueOnce({
        valid: true,
        errors: [],
        sanitized: { id: 1, name: 'A', x: true },
      });

      const mw = middleware.createMiddleware('user', { stripUnknown: true });

      const result: ValidationResult = mw({ id: 1, name: 'A', x: true });
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitized).toEqual({ id: 1, name: 'A' });
    });
  });

  describe('batchValidate', (): void => {
    test('should throw when schema not found', (): void => {
      expect(() => middleware.batchValidate('missing', [{}])).toThrowError(
        "Schema 'missing' not found",
      );
    });

    test('should validate each data object and return results array', (): void => {
      const schema: ValidationSchema = { rules: [{ field: 'id' }] };
      middleware.registerSchema('user', schema);

      const instance = mockedValidatorInstances[0] as unknown as {
        validate: ReturnType<typeof vi.fn>;
      };
      const r1: ValidationResult = { valid: true, errors: [], sanitized: { id: 1 } };
      const r2: ValidationResult = {
        valid: false,
        errors: [{ field: 'id', message: 'required' }],
        sanitized: {},
      };
      instance.validate.mockImplementationOnce(() => r1).mockImplementationOnce(() => r2);

      const results: ValidationResult[] = middleware.batchValidate('user', [{ id: 1 }, {}]);

      expect(instance.validate).toHaveBeenCalledTimes(2);
      expect(results).toEqual([r1, r2]);
    });
  });

  describe('batchValidationPassed', (): void => {
    test('should return true only if all results are valid', (): void => {
      const resultsAllOk: ValidationResult[] = [
        { valid: true, errors: [], sanitized: {} },
        { valid: true, errors: [], sanitized: {} },
      ];
      const resultsSomeFail: ValidationResult[] = [
        { valid: true, errors: [], sanitized: {} },
        { valid: false, errors: [{ message: 'e' }], sanitized: {} },
      ];

      expect(middleware.batchValidationPassed(resultsAllOk)).toBe(true);
      expect(middleware.batchValidationPassed(resultsSomeFail)).toBe(false);
    });
  });

  describe('getSchemaNames', (): void => {
    test('should return all registered schema names in insertion order', (): void => {
      const s1: ValidationSchema = { rules: [{ field: 'a' }] };
      const s2: ValidationSchema = { rules: [{ field: 'b' }] };
      middleware.registerSchema('first', s1);
      middleware.registerSchema('second', s2);

      expect(middleware.getSchemaNames()).toEqual(['first', 'second']);
    });
  });

  describe('getSchemaCount', (): void => {
    test('should return number of registered schemas', (): void => {
      expect(middleware.getSchemaCount()).toBe(0);
      middleware.registerSchema('one', { rules: [{ field: 'x' }] });
      middleware.registerSchema('two', { rules: [{ field: 'y' }] });
      expect(middleware.getSchemaCount()).toBe(2);
    });
  });

  describe('clearAll', (): void => {
    test('should clear all schemas and validators', (): void => {
      middleware.registerSchema('one', { rules: [{ field: 'x' }] });
      middleware.registerSchema('two', { rules: [{ field: 'y' }] });

      expect(middleware.getSchemaCount()).toBe(2);

      middleware.clearAll();

      expect(middleware.getSchemaCount()).toBe(0);
      expect(middleware.getSchemaNames()).toEqual([]);
      expect(() => middleware.validateWithSchema('one', {})).toThrowError(
        "Schema 'one' not found",
      );
    });
  });
});

describe('Global middleware singleton', (): void => {
  beforeEach((): void => {
    resetGlobalMiddleware();
  });

  afterEach((): void => {
    resetGlobalMiddleware();
  });

  describe('getGlobalMiddleware', (): void => {
    test('should create and return a global ValidationMiddleware instance', (): void => {
      const inst = getGlobalMiddleware();
      expect(inst).toBeInstanceOf(ValidationMiddleware);
    });

    test('should return the same instance across calls until reset', (): void => {
      const first = getGlobalMiddleware();
      const second = getGlobalMiddleware();
      expect(second).toBe(first);

      first.registerSchema('s', { rules: [{ field: 'a' }] });
      expect(second.getSchemaCount()).toBe(1);
    });
  });

  describe('resetGlobalMiddleware', (): void => {
    test('should reset the global instance so a new one is created next time', (): void => {
      const before = getGlobalMiddleware();
      before.registerSchema('s', { rules: [{ field: 'a' }] });
      expect(before.getSchemaCount()).toBe(1);

      resetGlobalMiddleware();

      const after = getGlobalMiddleware();
      expect(after).not.toBe(before);
      expect(after.getSchemaCount()).toBe(0);
    });
  });
});
