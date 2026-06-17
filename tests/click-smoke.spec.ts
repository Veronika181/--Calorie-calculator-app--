import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('click smoke test for local HTML pages', async ({ page }) => {
  const root = process.cwd();
  const htmlFiles = fs
    .readdirSync(root)
    .filter((name) => name.toLowerCase().endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));

  const failures: string[] = [];

  for (const file of htmlFiles) {
    const filePath = path.join(root, file);
    const url = pathToFileURL(filePath).href;

    const pageErrors: string[] = [];
    const onPageError = (err: Error) => pageErrors.push(err.message);
    page.on('pageerror', onPageError);

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);

    const buttonCount = await page.locator('button:visible').count();
    for (let i = 0; i < buttonCount; i++) {
      const button = page.locator('button:visible').nth(i);
      const type = ((await button.getAttribute('type')) || '').toLowerCase();

      // Skip form submit buttons to avoid backend-only form actions.
      if (type === 'submit') {
        continue;
      }

      try {
        const currentUrl = page.url();
        await button.click({ timeout: 2500, force: true });
        await page.waitForTimeout(120);

        if (page.url() !== currentUrl) {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(80);
        }
      } catch (err) {
        failures.push(`${file}: button #${i + 1} click failed (${String(err)})`);
      }
    }

    const linkCount = await page.locator('a[href]:visible').count();
    for (let i = 0; i < linkCount; i++) {
      const link = page.locator('a[href]:visible').nth(i);
      const href = (await link.getAttribute('href')) || '';

      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        continue;
      }

      try {
        const currentUrl = page.url();
        await link.click({ timeout: 2500, force: true });
        await page.waitForTimeout(120);

        if (page.url() !== currentUrl) {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(80);
        }
      } catch (err) {
        failures.push(`${file}: link #${i + 1} (href=${href}) click failed (${String(err)})`);
      }
    }

    if (pageErrors.length > 0) {
      failures.push(`${file}: pageerror -> ${pageErrors.join(' | ')}`);
    }

    page.off('pageerror', onPageError);
  }

  expect(failures, failures.join('\n')).toEqual([]);
});
