const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.in/s?k=amazon+basic&crid=1Z0DQYR39MP1E&sprefix=amazon+basic+%2Caps%2C383&ref=nb_sb_noss_2"
  );
  const productHandles = await page.$$(
    ".s-main-slot .s-result-list .s-search-results .sg-row"
  );
  for (const producthandle of productHandles) {
    const title = await page.evaluate(
      (el) =>
        el.querySelector(".a-size-base-plus .a-color-base .a-text-normal")
          .textContent,
      producthandle
    );
    console.log(title);
  }
})();
