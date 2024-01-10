const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProduct() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto(`https://www.amazon.in/gp/bestsellers/automotive/ref=zg_bs_automotive_sm`, { waitUntil: 'networkidle0' });

    const productHandles = await page.$$(".p13n-gridRow._cDEzb_grid-row_3Cywl");

    // Extracting all links
    let links = [];

    for (let productHandle of productHandles) {
        const productLinks = await productHandle.$$eval('.a-link-normal', (elements) =>
            elements.map(element => ({
                href: element.href || '', // Use empty string as fallback
            }))
        );

        links = links.concat(productLinks);
    }
    
    const loadedLinks = links.filter(link => link.href.trim() !== '');

    const output = {
        links: loadedLinks,
    };

    // Convert the object to JSON
    fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

    await browser.close();
}

scrapeProduct();
