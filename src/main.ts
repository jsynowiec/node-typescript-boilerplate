// Below is an example of using TSLint errors suppression

/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - Somebody's name
 * @param {number=} [delay=2000] - Number of milliseconds to delay resolution.
 * @returns {Promise<string>}
 */
function delayedHello(name: string, delay: number = 2000): Promise<string> {
  // tslint:disable-next-line no-string-based-set-timeout
  return new Promise((resolve) => setTimeout(() => resolve(`Hello, ${name}`), delay));
}

export default async function greeter(name) { // tslint:disable-line
  return await delayedHello(name);
}
