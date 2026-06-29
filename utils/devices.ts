import { devices, type PlaywrightTestConfig } from '@playwright/test';
import { Env } from './env';

type Project = NonNullable<PlaywrightTestConfig['projects']>[number];

const SUPPORTED_BROWSERS = ['chromium', 'firefox', 'webkit'] as const;
type BrowserName = (typeof SUPPORTED_BROWSERS)[number];

function isSupportedBrowser(value: string): value is BrowserName {
  return (SUPPORTED_BROWSERS as readonly string[]).includes(value);
}

function buildDesktopProject(browserName: BrowserName): Project {
  return {
    name: `${browserName}--desktop--${Env.platform}`,
    use: {
      browserName,
    },
  };
}

function buildMobileProject(deviceName: string): Project {
  const descriptor = devices[deviceName];
  if (!descriptor) {
    throw new Error(
      `Playwright device "${deviceName}" not found.\n` +
      `Run: npx playwright --list-devices to see all valid device names.`
    );
  }
  return {
    name: `${deviceName.replace(/\s+/g, '-')}--mobile--${Env.platform}`,
    use: { ...descriptor },
  };
}

export function buildProjects(): Project[] {
  if (Env.isMobile) {
    return [buildMobileProject(Env.device)];
  }

  if (Env.browser === '') {
    return SUPPORTED_BROWSERS.map(buildDesktopProject);
  }

  if (!isSupportedBrowser(Env.browser)) {
    throw new Error(
      `BROWSER="${Env.browser}" is not valid.\n` +
      `Valid options: chromium, firefox, webkit (or leave blank to run all).`
    );
  }

  return [buildDesktopProject(Env.browser)];
}
