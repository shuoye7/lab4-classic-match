const fs = require("node:fs");
const path = require("node:path");

const moduleRoot = process.env.CODEX_NODE_MODULES;
const { chromium } = require(
  moduleRoot ? path.join(moduleRoot, "playwright") : "playwright"
);

const baseUrl = process.env.APP_URL || "http://127.0.0.1:5516";
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function matchPair(page, pairId) {
  await page.locator(`[data-pair-id="${pairId}"]`).nth(0).click();
  await page.locator(`[data-pair-id="${pairId}"]`).nth(1).click();
}

async function main() {
  const frameDirectory = "tmp/v2-demo-frames";
  fs.rmSync(frameDirectory, { recursive: true, force: true });
  fs.mkdirSync(frameDirectory, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });

  await page.goto(`${baseUrl}/lab4-classic-match/`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(frameDirectory, "01-initial.png"),
    animations: "disabled"
  });

  await matchPair(page, "a1");
  await page.locator("#hintButton").click();
  await page.screenshot({
    path: path.join(frameDirectory, "02-hint.png"),
    animations: "disabled"
  });

  await page.locator("#pauseButton").click();
  await page.screenshot({
    path: path.join(frameDirectory, "03-paused.png"),
    animations: "disabled"
  });
  await page.locator("#pauseButton").click();

  for (const pairId of ["a2", "a3", "a4", "a5", "a6"]) {
    await matchPair(page, pairId);
  }
  await page.locator("#resultOverlay").waitFor({ state: "visible" });
  await page.screenshot({
    path: path.join(frameDirectory, "04-result.png"),
    animations: "disabled"
  });

  await page.locator("#closeResult").click();
  await page.locator(".bank-tab").nth(1).click();
  await page.screenshot({
    path: path.join(frameDirectory, "05-words-bank.png"),
    animations: "disabled"
  });

  await browser.close();
  console.log(`Captured Lab 4 demo frames in ${frameDirectory}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
