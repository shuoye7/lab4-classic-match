const assert = require("node:assert/strict");
const path = require("node:path");

const moduleRoot = process.env.CODEX_NODE_MODULES;
const { chromium } = require(
  moduleRoot ? path.join(moduleRoot, "playwright") : "playwright"
);

const baseUrl = process.env.APP_URL || "http://127.0.0.1:5516";
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });

  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 568 }
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/lab4-classic-match/`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });

    const audit = await page.evaluate(() => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      };

      return {
        pageOverflow:
          document.documentElement.scrollWidth > window.innerWidth + 1,
        outsideViewport: [
          ...document.querySelectorAll(
            ".brand, .top-controls, .game-column, .status-column, .control-button, .match-card"
          )
        ]
          .filter(isVisible)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              className: element.className,
              left: Math.round(rect.left),
              right: Math.round(rect.right)
            };
          })
          .filter((item) => item.left < -1 || item.right > window.innerWidth + 1),
        textOverflow: [
          ...document.querySelectorAll(
            ".page-heading h1, .board-heading h2, .control-button, .card-text, .scorebook-row"
          )
        ]
          .filter(isVisible)
          .filter(
            (element) =>
              element.scrollWidth > element.clientWidth + 2 ||
              element.scrollHeight > element.clientHeight + 2
          )
          .map((element) => ({
            text: element.textContent.trim(),
            width: element.clientWidth,
            scrollWidth: element.scrollWidth,
            height: element.clientHeight,
            scrollHeight: element.scrollHeight
          }))
      };
    });

    assert.equal(audit.pageOverflow, false);
    assert.deepEqual(audit.outsideViewport, []);
    assert.deepEqual(audit.textOverflow, []);
    await page.close();
  }

  await browser.close();
  console.log("Lab 4 V2 layout audit passed at 1440, 1024, 768, 390, and 320px.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
