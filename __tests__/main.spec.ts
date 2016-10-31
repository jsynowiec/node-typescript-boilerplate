import { greeter } from '../src/main';

it('should greet a user', () => {
  expect(greeter('John')).toBe('Hello, John');
});
