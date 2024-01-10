const puppeteer = require('puppeteer');

async function scrapeProduct(){
    //for seeing browser in action
    const browser = await puppeteer.launch({ headless: false , defaultViewport: null});

    const page = await browser.newPage();
    await page.goto(`https://www.yahoo.com/`, { waitUntil: 'load', timeout: 0 });


    const title = await page.title();

    console.log(title);
    

    const heading = await page.$eval('p', element => element.textContent);
    console.log(heading);

    await page.screenshot({path: 'yahoo.jpg'})
    await page.pdf({ path: 'yahoo.pdf', format: 'A4' });

    await browser.close();


}


scrapeProduct();