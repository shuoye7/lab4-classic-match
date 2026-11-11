const assert = require("node:assert/strict");
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

async function resetPage(page) {
  await page.goto(`${baseUrl}/lab4-classic-match/v1/`, {
    waitUntil: "networkidle"
  });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
}

async function matchPair(page, pairId) {
  await page.locator(`[data-pair-id="${pairId}"]`).nth(0).click();
  await page.locator(`[data-pair-id="${pairId}"]`).nth(1).click();
}

async function main() {
  fs.mkdirSync("screenshots/v1", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await resetPage(page);
  assert.equal(await page.title(), "句读 · 文言文连连看");
  assert.equal(await page.locator(".match-card").count(), 12);
  assert.equal(await page.locator(".bank-tab").count(), 3);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    ),
    true
  );

  await page.screenshot({
    path: "screenshots/v1/desktop-initial.png",
    fullPage: true,
    animations: "disabled"
  });

  await matchPair(page, "a1");
  assert.equal(await page.locator(".match-card.is-matched").count(), 2);
  assert.match(await page.locator("#feedbackTitle").textContent(), /配对正确/);
  assert.equal(
    await page.evaluate(
      () => window.__CLASSIC_MATCH__.getState().matchedPairs.length
    ),
    1
  );
  await page.screenshot({
    path: "screenshots/v1/desktop-match.png",
    fullPage: true,
    animations: "disabled"
  });

  const firstCard = page.locator(".match-card:not(.is-matched)").nth(0);
  const firstPairId = await firstCard.getAttribute("data-pair-id");
  const otherCard = page
    .locator(`.match-card:not(.is-matched):not([data-pair-id="${firstPairId}"])`)
    .nth(0);
  await firstCard.click();
  await otherCard.click();
  assert.match(await page.locator("#feedbackTitle").textContent(), /没有连上/);
  assert.equal(await page.locator(".match-card.is-error").count(), 2);
  await page.waitForTimeout(850);

  for (const pairId of ["a2", "a3", "a4", "a5", "a6"]) {
    await matchPair(page, pairId);
  }
  await page.locator("#resultOverlay").waitFor({ state: "visible" });
  assert.equal(await page.locator("#resultErrors").textContent(), "1");
  assert.equal(
    await page.evaluate(
      () => window.__CLASSIC_MATCH__.getState().matchedPairs.length
    ),
    6
  );
  await page.screenshot({
    path: "screenshots/v1/desktop-result.png",
    fullPage: true,
    animations: "disabled"
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });
  await resetPage(mobile);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    ),
    true
  );
  await mobile.screenshot({
    path: "screenshots/v1/mobile-initial.png",
    fullPage: false,
    animations: "disabled"
  });

  assert.deepEqual(errors, []);
  await browser.close();
  console.log("Lab 4 V1 smoke test passed: matching, feedback, completion and mobile layout.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
