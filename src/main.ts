import { config } from 'dotenv';
config();

export const run = async (): Promise<void> => {
  console.log('main::run executed');
};

run();
