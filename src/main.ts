/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - Somebody's name
 * @param {number=} [delay=2000] - Number of milliseconds to delay resolution.
 * @returns {Promise<string>}
 */
function delayedHello(name: string, delay: number = 2000): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`Hello, ${name}`), delay));
}

// Below is an example of using TSLint errors suppression
// Here it's supressing mising type definitions for greeter function

export default async function greeter(name) { // tslint:disable-line typedef
  return await delayedHello(name);
}
