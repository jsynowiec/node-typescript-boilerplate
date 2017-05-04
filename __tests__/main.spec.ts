import greeter from '../src/main';

jest.useFakeTimers();

it('delays the greeting by 2 seconds', async () => {
  expect.assertions(2);
  const promise: Promise<string> = greeter('John');
  jest.runOnlyPendingTimers();
  await promise;
  expect((<jest.Mock<void>> setTimeout).mock.calls.length).toBe(1);
  expect((<jest.Mock<void>> setTimeout).mock.calls[0][1]).toBe(2000);
});

it('greets a user with `Hello, {name}` message', async () => {
  const promise: Promise<string> = greeter('John');
  jest.runOnlyPendingTimers();
  const hello: string = await promise;
  expect(hello).toBe('Hello, John');
});
