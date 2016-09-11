import main from '../src/main';

describe('main module', function () {
  it('should export greeter function', () => {
    expect(typeof main.greeter).toBe('function');
  });

  describe('greeter function', function () {
    it('should greet a user', () => {
      expect(main.greeter('John')).toBe('Hello, John');
    });
  });
});
