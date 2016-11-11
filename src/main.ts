// Below is an example of using both, the tslint errors suppression

function delayedHello(name: string, delay: number = 2000): Promise<string> {
  // tslint:disable-next-line no-string-based-set-timeout
  return new Promise((resolve) => setTimeout(resolve(`Hello, ${name}`), delay));
}

export default async function greeter(name) { // tslint:disable-line
  return await delayedHello(name);
}
