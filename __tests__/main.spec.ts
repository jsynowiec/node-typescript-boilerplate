import { run } from '../src/main';

describe('main file', () => {
  it('should have called the `run`', async () => {
    const result: void = await run();
    expect(result).toEqual(undefined);
  });
});
