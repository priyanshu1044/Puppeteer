const puppeteer = require('puppeteer');

async function scrapeProduct(){
    //for seeing browser in action
    const browser = await puppeteer.launch({ 
        headless: false , //for seeing browser in action
        defaultViewport: null,//for full screen
        devtools: true,//automatically open inspect element
        slowMo: 1000,//slow down by 1 second
        env:"dev"
    
    
    });

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