import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/validation/schemas.js', () => {
  class SchemaBuilder {
    private cfg: Record<string, unknown>;

    public constructor(cfg: Record<string, unknown>) {
      this.cfg = cfg;
    }

    public build(): Record<string, unknown> {
      return { ok: true, ...this.cfg };
    }
  }

  const ValidationLevel = { STRICT: 'strict', LAX: 'lax' } as const;

  return {
    SchemaBuilder,
    ValidationLevel,
  };
});

vi.mock('../../src/validation/validator.js', () => {
  class Validator {
    public schema: unknown;

    public constructor(schema: unknown) {
      this.schema = schema;
    }

    public validate(data: unknown): { valid: boolean; data: unknown } {
      if (data === 'throw') {
        throw new Error('validation failed');
      }
      return { valid: true, data };
    }
  }

  const validateData = vi.fn((data: unknown, schema: unknown): { ok: boolean; data: unknown; schema: unknown } => {
    if (schema === null) {
      throw new Error('no schema');
    }
    return { ok: true, data, schema };
  });

  return {
    Validator,
    validateData,
  };
});

vi.mock('../../src/validation/middleware.js', () => {
  let globalMiddleware: ((input: unknown) => Record<string, unknown>) | undefined;

  const ValidationMiddleware = vi.fn((options?: { level?: string }): ((input: unknown) => Record<string, unknown>) => {
    if (options && options.level === 'bad') {
      throw new Error('bad options');
    }
    const handler = vi.fn((input: unknown): Record<string, unknown> => ({ handled: true, input, options }));
    globalMiddleware = handler;
    return handler;
  });

  const getGlobalMiddleware = vi.fn((): ((input: unknown) => Record<string, unknown>) | undefined => globalMiddleware);

  const resetGlobalMiddleware = vi.fn((): void => {
    globalMiddleware = undefined;
  });

  return {
    ValidationMiddleware,
    getGlobalMiddleware,
    resetGlobalMiddleware,
  };
});

describe('validation index barrel exports', () => {
  beforeEach((): void => {
    vi.resetModules();
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  describe('schemas exports', () => {
    test('should re-export SchemaBuilder and ValidationLevel and preserve identity', async (): Promise<void> => {
      const index = await import('../../src/validation/index');
      const schemas = await import('../../src/validation/schemas.js');

      expect(index.SchemaBuilder).toBe(schemas.SchemaBuilder);
      expect(index.ValidationLevel).toBe(schemas.ValidationLevel);

      const builder = new index.SchemaBuilder({ foo: 'bar' });
      const result = builder.build();
      expect(result).toEqual({ ok: true, foo: 'bar' });

      // sanity on enum-like object
      expect(Object.keys(index.ValidationLevel)).toEqual(['STRICT', 'LAX']);
      expect(index.ValidationLevel.STRICT).toBe('strict');
      expect(index.ValidationLevel.LAX).toBe('lax');
    });
  });

  describe('validator exports', () => {
    test('should re-export Validator and validateData and preserve identity', async (): Promise<void> => {
      const index = await import('../../src/validation/index');
      const validatorModule = await import('../../src/validation/validator.js');

      expect(index.Validator).toBe(validatorModule.Validator);
      expect(index.validateData).toBe(validatorModule.validateData);

      const validator = new index.Validator({ type: 'mock-schema' });
      const ok = validator.validate({ id: 1 });
      expect(ok).toEqual({ valid: true, data: { id: 1 } });

      const validated = index.validateData('payload', { schema: true });
      expect(validated).toEqual({ ok: true, data: 'payload', schema: { schema: true } });
      expect(validatorModule.validateData).toHaveBeenCalledTimes(1);
      expect(validatorModule.validateData).toHaveBeenCalledWith('payload', { schema: true });
    });

    test('should propagate errors from Validator.validate and validateData', async (): Promise<void> => {
      const index = await import('../../src/validation/index');

      const validator = new index.Validator({ type: 'mock-schema' });
      expect(() => validator.validate('throw')).toThrowError('validation failed');

      expect(() => index.validateData('payload', null as unknown)).toThrowError('no schema');
    });
  });

  describe('middleware exports', () => {
    test('should re-export middleware functions and preserve identity', async (): Promise<void> => {
      const index = await import('../../src/validation/index');
      const middlewareModule = await import('../../src/validation/middleware.js');

      expect(index.ValidationMiddleware).toBe(middlewareModule.ValidationMiddleware);
      expect(index.getGlobalMiddleware).toBe(middlewareModule.getGlobalMiddleware);
      expect(index.resetGlobalMiddleware).toBe(middlewareModule.resetGlobalMiddleware);
    });

    test('should create and use middleware, manage global state', async (): Promise<void> => {
      const index = await import('../../src/validation/index');

      // Ensure clean state at start
      index.resetGlobalMiddleware();
      expect(index.getGlobalMiddleware()).toBeUndefined();

      const handler = index.ValidationMiddleware({ level: 'strict' } as unknown);
      expect(typeof handler).toBe('function');

      const handled = handler({ x: 1 });
      expect(handled).toEqual({ handled: true, input: { x: 1 }, options: { level: 'strict' } });

      const globalHandler = index.getGlobalMiddleware();
      expect(globalHandler).toBe(handler);

      index.resetGlobalMiddleware();
      expect(index.getGlobalMiddleware()).toBeUndefined();
    });

    test('should propagate errors from ValidationMiddleware for bad options', async (): Promise<void> => {
      const index = await import('../../src/validation/index');

      expect(() => index.ValidationMiddleware({ level: 'bad' } as unknown)).toThrowError('bad options');
    });
  });
});
