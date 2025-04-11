import { test, expect } from "@playwright/test";

test("Pages router test case", async ({ page }) => {
  await page.goto("/pages");

  // Locate the output element (adjust selector as needed)
  const outputElement = page.locator('.container');

  // Grab the entire HTML from the element
  const outputHtml = await outputElement.evaluate(el => el.outerHTML);

  // Compare against a stored snapshot
  expect(outputHtml).toMatchSnapshot();
});
