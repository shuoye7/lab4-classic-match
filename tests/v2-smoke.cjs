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
  await page.goto(`${baseUrl}/lab4-classic-match/`, {
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
  fs.mkdirSync("screenshots/v2", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 }
  });
  const page = await context.newPage();
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await resetPage(page);
  assert.equal(await page.locator(".match-card").count(), 12);
  assert.equal(await page.locator("#hintCount").textContent(), "3");
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    ),
    true
  );
  await page.screenshot({
    path: "screenshots/v2/desktop-initial.png",
    fullPage: true,
    animations: "disabled"
  });

  await page.locator("#soundToggle").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("classic-match-v2-sound")),
    "off"
  );
  await page.locator("#soundToggle").click();

  await matchPair(page, "a1");
  assert.equal(
    await page.evaluate(() => window.__CLASSIC_MATCH__.getState().matchedPairs.length),
    1
  );

  await page.locator("#hintButton").click();
  assert.equal(await page.locator("#hintCount").textContent(), "2");
  assert.equal(await page.locator(".match-card.is-hinted").count(), 2);
  assert.equal(
    await page.evaluate(() => window.__CLASSIC_MATCH__.getState().hintsLeft),
    2
  );
  await page.screenshot({
    path: "screenshots/v2/desktop-hint.png",
    fullPage: true,
    animations: "disabled"
  });

  await page.locator("#pauseButton").click();
  assert.equal(
    await page.evaluate(() => window.__CLASSIC_MATCH__.getState().paused),
    true
  );
  assert.equal(await page.locator("#pauseVeil").isVisible(), true);
  await page.locator("#pauseButton").click();
  assert.equal(
    await page.evaluate(() => window.__CLASSIC_MATCH__.getState().paused),
    false
  );

  const firstCard = page.locator(".match-card:not(.is-matched)").nth(0);
  const firstPairId = await firstCard.getAttribute("data-pair-id");
  const otherCard = page
    .locator(`.match-card:not(.is-matched):not([data-pair-id="${firstPairId}"])`)
    .nth(0);
  await firstCard.click();
  await otherCard.click();
  assert.match(await page.locator("#feedbackText").textContent(), /原句|文言词/);
  await page.waitForTimeout(1000);

  for (const pairId of ["a2", "a3", "a4", "a5", "a6"]) {
    if ((await page.locator(`[data-pair-id="${pairId}"]:not(.is-matched)`).count()) === 2) {
      await matchPair(page, pairId);
    }
  }

  await page.locator("#resultOverlay").waitFor({ state: "visible" });
  assert.equal(await page.locator("#resultHints").textContent(), "1");
  assert.equal(await page.locator(".scorebook-row.is-current").count(), 1);
  const scorebook = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("classic-match-v2-scorebook"))
  );
  assert.equal(Boolean(scorebook.analects), true);
  await page.screenshot({
    path: "screenshots/v2/desktop-result.png",
    fullPage: true,
    animations: "disabled"
  });

  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await resetPage(mobile);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    ),
    true
  );
  assert.equal(await mobile.locator(".match-card").count(), 12);
  await mobile.screenshot({
    path: "screenshots/v2/mobile-initial.png",
    fullPage: false,
    animations: "disabled"
  });
  await matchPair(mobile, "a1");
  await mobile.locator("#feedbackBar").scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(150);
  await mobile.screenshot({
    path: "screenshots/v2/mobile-match.png",
    fullPage: false,
    animations: "disabled"
  });

  assert.deepEqual(errors, []);
  await context.close();
  await browser.close();
  console.log("Lab 4 V2 smoke test passed: sound, hints, pause, scorebook, completion and mobile layout.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
