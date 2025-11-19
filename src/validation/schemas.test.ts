import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { SchemaBuilder, ValidationLevel } from '../../src/validation/schemas';

describe('SchemaBuilder', (): void => {
  let builder: SchemaBuilder;

  beforeEach((): void => {
    builder = new SchemaBuilder('TestSchema');
  });

  afterEach((): void => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('constructor', (): void => {
    test('should initialize with default values', (): void => {
      const schema = builder.build();
      expect(schema).toBeDefined();
      expect(schema.name).toBe('TestSchema');
      expect(schema.level).toBe(ValidationLevel.Moderate);
      expect(Array.isArray(schema.rules)).toBe(true);
      expect(schema.rules.length).toBe(0);
      expect(schema.allowUnknownFields).toBe(false);
    });

    test('should set provided validation level', (): void => {
      const custom = new SchemaBuilder('Custom', ValidationLevel.Strict);
      const schema = custom.build();
      expect(schema.name).toBe('Custom');
      expect(schema.level).toBe(ValidationLevel.Strict);
    });
  });

  describe('addRule', (): void => {
    test('should add a custom rule and be chainable', (): void => {
      const customValidator = (value: unknown): boolean => typeof value === 'string';
      const returned = builder.addRule({
        field: 'custom',
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 10,
        pattern: /^[a-z]+$/i,
        customValidator,
        errorMessage: 'Custom error',
      });

      expect(returned).toBe(builder);

      const schema = builder.build();
      expect(schema.rules.length).toBe(1);
      const rule = schema.rules[0];
      expect(rule.field).toBe('custom');
      expect(rule.type).toBe('string');
      expect(rule.required).toBe(true);
      expect(rule.minLength).toBe(2);
      expect(rule.maxLength).toBe(10);
      expect(rule.errorMessage).toBe('Custom error');
      expect(rule.customValidator).toBe(customValidator);
      expect(rule.pattern).toBeInstanceOf(RegExp);
      const regex = rule.pattern as RegExp;
      expect(regex.source).toBe('^[a-z]+$');
      expect(regex.flags).toContain('i');
    });

    test('should allow duplicate fields without throwing', (): void => {
      builder.addRule({ field: 'dup', type: 'string', required: true });
      builder.addRule({ field: 'dup', type: 'number', required: false });
      const schema = builder.build();
      expect(schema.rules.length).toBe(2);
      expect(schema.rules[0].field).toBe('dup');
      expect(schema.rules[1].field).toBe('dup');
      expect(schema.rules[0].type).toBe('string');
      expect(schema.rules[1].type).toBe('number');
    });
  });

  describe('stringField', (): void => {
    test('should add a required string field with options', (): void => {
      const returned = builder.stringField('username', true, {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-z0-9_]+$/i,
        errorMessage: 'Invalid username',
      });
      expect(returned).toBe(builder);

      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'username');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('string');
      expect(rule.required).toBe(true);
      expect(rule.minLength).toBe(3);
      expect(rule.maxLength).toBe(20);
      expect(rule.errorMessage).toBe('Invalid username');
      expect(rule.pattern).toBeInstanceOf(RegExp);
      const regex = rule.pattern as RegExp;
      expect(regex.source).toBe('^[a-z0-9_]+$');
      expect(regex.flags).toContain('i');
    });

    test('should add an optional string field when required is false', (): void => {
      builder.stringField('nickname', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'nickname');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('string');
      expect(rule.required).toBe(false);
    });
  });

  describe('numberField', (): void => {
    test('should add a required number field with range', (): void => {
      builder.numberField('age', true, { min: 0, max: 120, errorMessage: 'Bad age' });
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'age');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('number');
      expect(rule.required).toBe(true);
      expect(rule.min).toBe(0);
      expect(rule.max).toBe(120);
      expect(rule.errorMessage).toBe('Bad age');
    });

    test('should add an optional number field when required is false', (): void => {
      builder.numberField('score', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'score');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('number');
      expect(rule.required).toBe(false);
    });
  });

  describe('emailField', (): void => {
    test('should add a required email field with default error message and regex', (): void => {
      builder.emailField('email');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'email');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('email');
      expect(rule.required).toBe(true);
      expect(rule.errorMessage).toBe('Invalid email format');
      expect(rule.pattern).toBeInstanceOf(RegExp);
      const regex = rule.pattern as RegExp;
      expect(regex.source).toBe('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
      expect(regex.flags).toBe('');
    });

    test('should allow custom error message for email field', (): void => {
      builder.emailField('email2', true, 'Bad email');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'email2');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('email');
      expect(rule.errorMessage).toBe('Bad email');
    });

    test('should add an optional email field when required is false', (): void => {
      builder.emailField('altEmail', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'altEmail');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.required).toBe(false);
    });
  });

  describe('urlField', (): void => {
    test('should add a required url field with default error message', (): void => {
      builder.urlField('site');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'site');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('url');
      expect(rule.required).toBe(true);
      expect(rule.errorMessage).toBe('Invalid URL format');
    });

    test('should add an optional url field with custom error message', (): void => {
      builder.urlField('site2', false, 'Bad URL');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'site2');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('url');
      expect(rule.required).toBe(false);
      expect(rule.errorMessage).toBe('Bad URL');
    });
  });

  describe('booleanField', (): void => {
    test('should add a required boolean field by default', (): void => {
      builder.booleanField('acceptedTerms');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'acceptedTerms');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('boolean');
      expect(rule.required).toBe(true);
    });

    test('should add an optional boolean field when required is false', (): void => {
      builder.booleanField('newsletter', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'newsletter');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('boolean');
      expect(rule.required).toBe(false);
    });
  });

  describe('arrayField', (): void => {
    test('should add a required array field by default', (): void => {
      builder.arrayField('tags');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'tags');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('array');
      expect(rule.required).toBe(true);
    });

    test('should add an optional array field when required is false', (): void => {
      builder.arrayField('images', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'images');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('array');
      expect(rule.required).toBe(false);
    });
  });

  describe('objectField', (): void => {
    test('should add a required object field by default', (): void => {
      builder.objectField('profile');
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'profile');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('object');
      expect(rule.required).toBe(true);
    });

    test('should add an optional object field when required is false', (): void => {
      builder.objectField('settings', false);
      const schema = builder.build();
      const rule = schema.rules.find((r) => r.field === 'settings');
      expect(rule).toBeDefined();
      if (!rule) throw new Error('rule should be defined');
      expect(rule.type).toBe('object');
      expect(rule.required).toBe(false);
    });
  });

  describe('allowUnknown', (): void => {
    test('should enable and disable unknown fields', (): void => {
      builder.allowUnknown(true);
      let schema = builder.build();
      expect(schema.allowUnknownFields).toBe(true);

      builder.allowUnknown(false);
      schema = builder.build();
      expect(schema.allowUnknownFields).toBe(false);
    });

    test('should be chainable', (): void => {
      const returned = builder.allowUnknown(true);
      expect(returned).toBe(builder);
    });
  });

  describe('setLevel', (): void => {
    test('should set level to Strict', (): void => {
      builder.setLevel(ValidationLevel.Strict);
      const schema = builder.build();
      expect(schema.level).toBe(ValidationLevel.Strict);
    });

    test('should set level to Lenient', (): void => {
      builder.setLevel(ValidationLevel.Lenient);
      const schema = builder.build();
      expect(schema.level).toBe(ValidationLevel.Lenient);
    });

    test('should be chainable', (): void => {
      const returned = builder.setLevel(ValidationLevel.Moderate);
      expect(returned).toBe(builder);
    });
  });

  describe('build', (): void => {
    test('should return a shallow copy (top-level primitives not linked)', (): void => {
      builder
        .stringField('a')
        .numberField('b', false)
        .setLevel(ValidationLevel.Strict)
        .allowUnknown(true);

      const snapshot1 = builder.build();
      expect(snapshot1.level).toBe(ValidationLevel.Strict);
      expect(snapshot1.allowUnknownFields).toBe(true);
      expect(snapshot1.rules.length).toBe(2);

      // Modify top-level properties on returned object
      snapshot1.level = ValidationLevel.Lenient;
      snapshot1.allowUnknownFields = false;

      // Build again and verify builder internal state not affected by top-level changes
      const snapshot2 = builder.build();
      expect(snapshot2.level).toBe(ValidationLevel.Strict);
      expect(snapshot2.allowUnknownFields).toBe(true);
    });

    test('should return a shallow copy (rules array is shared/mutable)', (): void => {
      builder.stringField('initial');

      const built1 = builder.build();
      expect(built1.rules.length).toBe(1);

      // Mutate the rules array in the built object
      built1.rules.push({
        field: 'mutatedFromOutside',
        type: 'string',
        required: true,
      });

      // Because build returns a shallow copy, the rules array is shared
      const built2 = builder.build();
      expect(built2.rules.length).toBe(2);
      const fields = built2.rules.map((r) => r.field);
      expect(fields).toContain('mutatedFromOutside');
    });

    test('should preserve insertion order of rules', (): void => {
      builder
        .stringField('first')
        .numberField('second')
        .booleanField('third')
        .arrayField('fourth')
        .objectField('fifth');

      const schema = builder.build();
      const fields = schema.rules.map((r) => r.field);
      expect(fields).toEqual(['first', 'second', 'third', 'fourth', 'fifth']);
    });

    test('should not throw when building a schema with many rules', (): void => {
      expect((): unknown => {
        builder
          .stringField('s1')
          .stringField('s2', false, { minLength: 0, maxLength: 100 })
          .numberField('n1', true, { min: -10, max: 10 })
          .emailField('e1')
          .urlField('u1', false, 'URL error')
          .booleanField('b1')
          .arrayField('a1', false)
          .objectField('o1', true)
          .allowUnknown(true)
          .setLevel(ValidationLevel.Moderate)
          .build();
        return null;
      }).not.toThrow();
    });
  });

  describe('method chainability', (): void => {
    test('all builder methods should be chainable', (): void => {
      const returned = builder
        .stringField('s')
        .numberField('n')
        .emailField('e')
        .urlField('u')
        .booleanField('b')
        .arrayField('a')
        .objectField('o')
        .allowUnknown(true)
        .setLevel(ValidationLevel.Strict)
        .addRule({ field: 'x', type: 'string', required: true });
      expect(returned).toBe(builder);
    });
  });
});
