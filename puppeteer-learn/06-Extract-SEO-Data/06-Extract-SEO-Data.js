const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProduct() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();


    async function extractContent(page, selector) {
        const element = await page.$(selector);
        return element ? await page.evaluate(el => el.textContent, element) : null;
    }

    // Navigate to a website
    await page.goto(`https://www.amazon.in/gp/bestsellers/automotive/ref=zg_bs_automotive_sm`, { waitUntil: 'networkidle0' });


    // SEO Data

    // Title
    const title = await page.title();

    // Description
    const description = await extractContent(page, 'meta[name="description"]');
    const metaKeywords = await extractContent(page, 'meta[name="keywords"]');

    // Extracting all links

    const links = await page.$$eval('a', (elements) =>
        elements.map(element => ({
            href: element.href,
            text: element.textContent,
        }))
    );

    //extracting all images

    const images = await page.$$eval('img', (elements) =>
        elements.map(element => ({
            src: element.src,
            alt: element.alt,
        }))
    );

    const output = {
        title,
        description,
        metaKeywords,
        links,
        images
    };

    // Convert the object to JSON and log it
    // console.log(JSON.stringify(output, null, 2));

    fs.writeFileSync('output.json', JSON.stringify(output, null, 2));


    await browser.close();

}
scrapeProduct();