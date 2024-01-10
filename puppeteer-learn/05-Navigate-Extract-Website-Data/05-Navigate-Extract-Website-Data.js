const puppeteer = require('puppeteer');

async function scrapeProduct() {
    //for seeing browser in action
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto(`https://www.amazon.in/gp/bestsellers/automotive/ref=zg_bs_automotive_sm`, { waitUntil: 'networkidle0' });

    // Extract Image from a website
    const images = await page.$$eval('img', (elements) =>
        elements.map(element => ({
            src: element.src,
            alt: element.alt,
        }))
    );
    const titles = await page.$$eval('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1', (elements) =>
        elements.map(element => ({
            text: element.textContent,
        }))
    );

    const prices = await page.$$eval('._cDEzb_p13n-sc-price_3mJ9Z', (elements) =>
        elements.map(element => ({
            text: element.textContent,
        }))
    );

    // // Extract links from a website
    // const links = await page.$$eval('a', (elements) =>
    //     elements.map(element => ({
    //         href: element.href,
    //         text: element.textContent,
    //     }))
    // );

    // Count images on the website
    // const imageCount = images.length;

    // // Count links on the website
    // const linkCount = links.length;



    // Combine the data into a single object
    const output = {
        images,
        titles,
        prices,
        // links,
        // imageCount,
        // linkCount,
    };

    // Convert the object to JSON and log it
    console.log(JSON.stringify(output, null, 2));

    await browser.close();
}

scrapeProduct();
