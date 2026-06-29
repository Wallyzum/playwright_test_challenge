import 'dotenv/config';

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

export const Env = {
  baseUrl:       process.env.BASE_URL        ?? 'http://localhost:3100',
  browser:       process.env.BROWSER         ?? '',   // empty string = run all browsers
  headless:      parseBoolean(process.env.HEADLESS, true),
  isMobile:      parseBoolean(process.env.IS_MOBILE, false),
  device:        process.env.DEVICE          ?? 'iPhone 13',
  platform:      process.env.PLATFORM        ?? 'linux',
  loginUsername: process.env.LOGIN_USERNAME  ?? 'johndoe19',
  loginPassword: process.env.LOGIN_PASSWORD  ?? 'supersecret',
} as const;
