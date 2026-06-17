import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('click smoke test for local HTML pages', async ({ page }) => {
  test.setTimeout(180000);

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

    let buttonIndex = 0;
    while (true) {
      const buttons = await page.locator('button:visible').elementHandles();
      if (buttonIndex >= buttons.length) break;

      const button = buttons[buttonIndex];
      const type = ((await button.getAttribute('type')) || '').toLowerCase();

      // Skip form submit buttons to avoid backend-only form actions.
      if (type === 'submit') {
        buttonIndex++;
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
        failures.push(`${file}: button #${buttonIndex + 1} click failed (${String(err)})`);
      }

      buttonIndex++;
    }

    let linkIndex = 0;
    while (true) {
      const links = await page.locator('a[href]:visible').elementHandles();
      if (linkIndex >= links.length) break;

      const link = links[linkIndex];
      const href = (await link.getAttribute('href')) || '';

      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        linkIndex++;
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
        failures.push(`${file}: link #${linkIndex + 1} (href=${href}) click failed (${String(err)})`);
      }

      linkIndex++;
    }

    if (pageErrors.length > 0) {
      failures.push(`${file}: pageerror -> ${pageErrors.join(' | ')}`);
    }

    page.off('pageerror', onPageError);
  }

  expect(failures, failures.join('\n')).toEqual([]);
});
