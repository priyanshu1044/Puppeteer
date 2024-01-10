const puppeteer = require('puppeteer');
const fs = require('fs');

async function sourceCode(url, outputFile) {
    try{
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const sourceCode = await page.content();
        fs.writeFileSync(outputFile, sourceCode, 'utf-8');
        await browser.close();
    }
    catch(err){
        console.log(err);
    }
}

sourceCode(`https://example.com/`, 'output.html');