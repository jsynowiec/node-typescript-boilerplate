import { delayedHello } from '@/delayedHello/delayedHello.js';

/**
 * Some predefined delay values (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

// eslint-disable-next-line
export async function greeter(name: any) {
  // The name parameter should be of type string. Any is used only to trigger the rule.
  return await delayedHello(name, Delays.Long);
}

console.log(`${await greeter('World')}!`);
