import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDirs = [
  'C:\\Users\\Gabriel-Nitro\\Documents\\calculus\\screenshots',
  'C:\\Users\\Gabriel-Nitro\\Documents\\calculus\\beege-docs\\screenshots'
];

for (const dir of outDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function capture() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  // Mobile viewport matching modern smartphone (iPhone 14 / modern Android)
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  async function saveScreenshot(name) {
    for (const dir of outDirs) {
      const targetPath = path.join(dir, name);
      await page.screenshot({ path: targetPath, fullPage: false });
      console.log(`Saved: ${targetPath}`);
    }
  }

  // 1. Dashboard
  console.log('Capturing Dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await saveScreenshot('01_dashboard.png');

  // 2. Teoria (KaTeX)
  console.log('Capturing Teoria...');
  await page.goto('http://localhost:5173/topico/a1111111-1111-1111-1111-111111111111', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await saveScreenshot('02_teoria.png');

  // 3. Pratica (Question and resolution)
  console.log('Capturing Pratica...');
  await page.goto('http://localhost:5173/pratica', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Click first alternative to trigger instant resolution feedback
  const firstOption = page.locator('.pratica-option-btn, .option-btn, button[class*="option"]').first();
  if (await firstOption.isVisible()) {
    await firstOption.click();
    await page.waitForTimeout(1000);
  }
  await saveScreenshot('03_pratica.png');

  // 4. Forum
  console.log('Capturing Forum...');
  await page.goto('http://localhost:5173/forum', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await saveScreenshot('04_forum.png');

  // 5. Perfil
  console.log('Capturing Perfil...');
  await page.goto('http://localhost:5173/perfil', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await saveScreenshot('05_perfil.png');

  // 6. Universidades
  console.log('Capturing Universidades...');
  await page.goto('http://localhost:5173/universidades', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await saveScreenshot('06_universidades.png');

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
