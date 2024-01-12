const puppeteer = require('puppeteer');

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

async function fastUpDownScroll(page, durationInSeconds) {
    const scrollInterval = 1000;
    const pauseDuration = 2000;
    const scrollDistance = 1000;
    const halfwayPoint = 0.5;

    const endTime = Date.now() + durationInSeconds * 1000;

    while (Date.now() < endTime) {
        await page.mouse.wheel({ deltaY: lerp(0, scrollDistance, halfwayPoint) });
        await page.waitForTimeout(scrollInterval);

        await page.waitForTimeout(pauseDuration);

        await page.mouse.wheel({ deltaY: lerp(scrollDistance, 0, halfwayPoint) });
        await page.waitForTimeout(scrollInterval);

        await page.waitForTimeout(pauseDuration);
    }
}

async function scrapeProduct() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    try {
        await page.goto(`https://shareus.io/oXpETY`, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);
        console.log('Page loaded successfully');

        // Replace manualClick with the automated approach
        await page.mouse.click(300, 200, { button: 'left' }); // Change coordinates based on your actual link position
        console.log('Clicked on a link, scrolled, and closed tab');

        await fastUpDownScroll(page, 10);

        const button = await page.$('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeLarge.MuiButton-textSizeLarge.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeLarge.MuiButton-textSizeLarge.css-sj49mn');

        if (button) {
            await Promise.all([
                button.click(),
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 })
            ]);
            console.log('Button clicked successfully');
        }

    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        await browser.close();
        console.log('Browser closed');
    }
}

scrapeProduct();