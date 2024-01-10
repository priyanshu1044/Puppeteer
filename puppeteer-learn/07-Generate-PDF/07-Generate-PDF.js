const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProduct(url, outputFile) {
    try {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });


        await page.pdf({ path: outputFile, format: 'A4' });
        await browser.close();
    }catch(err){
        console.log(err);
    }

}

scrapeProduct(`https://www.amazon.in/gp/bestsellers/automotive/ref=zg_bs_automotive_sm`, 'output.pdf');
