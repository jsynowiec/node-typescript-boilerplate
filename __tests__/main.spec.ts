import greeter from '../src/main';

describe('greeter function', () => {
  jest.useFakeTimers();

  let hello: string;

  beforeAll(async () => {
    const p: Promise<string> = greeter('John');
    jest.runOnlyPendingTimers();
    hello = await p;
  });

  it('delays the greeting by 2 seconds', () => {
    expect((<jest.Mock<void>> setTimeout).mock.calls.length).toBe(1);
    expect((<jest.Mock<void>> setTimeout).mock.calls[0][1]).toBe(2000);
  });

  it('greets a user with `Hello, {name}` message', () => {
    expect(hello).toBe('Hello, John');
  });

});
