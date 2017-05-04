import greeter from '../src/main';

describe('greeter function', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  let hello: string;

  // Act before assertions
  beforeAll(async () => {
    const p: Promise<string> = greeter('John');
    jest.runOnlyPendingTimers();
    hello = await p;
  });

  // Assert if setTimeout was called properly
  it('delays the greeting by 2 seconds', () => {
    expect((<jest.Mock<void>> setTimeout).mock.calls.length).toBe(1);
    expect((<jest.Mock<void>> setTimeout).mock.calls[0][1]).toBe(2000);
  });

  // Assert greeter result
  it('greets a user with `Hello, {name}` message', () => {
    expect(hello).toBe('Hello, John');
  });

});
