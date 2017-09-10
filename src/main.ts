/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - Somebody's name
 * @param {number=} [delay=2000] - Number of milliseconds to delay resolution.
 * @returns {Promise<string>}
 */
function delayedHello(name: string, delay: number = 2000): Promise<string> {
  return new Promise<string>(
    (resolve: (value?: string | PromiseLike<string>) => void) => setTimeout(
      () => resolve(`Hello, ${name}`),
      delay,
    ),
  );
}

// Below is an example of using TSLint errors suppression
// Here it's supressing missing type definitions for greeter function

export async function greeter(name) { // tslint:disable-line typedef
  return await delayedHello(name); // tslint:disable-line no-unsafe-any
}
