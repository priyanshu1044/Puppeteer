



const puppeteer = require('puppeteer');

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
async function clickLink(page, selector) {
    const link = await page.$(selector);
    if (link) {
        await page.evaluate(link => link.click(), link);
    } else {
        console.log('Link not found');
    }
}

async function fastUpDownScroll(page, durationInSeconds) {
    const scrollInterval = 1000; // Duration of each scroll motion in milliseconds
    const pauseDuration = 2000; // Duration to wait at the bottom and top of the page in milliseconds
    const scrollDistance = 1000; // Distance to scroll in deltaY
    const halfwayPoint = 0.5; // Fraction of the page height to scroll down to

    const endTime = Date.now() + durationInSeconds * 1000;

    while (Date.now() < endTime) {
        // Scroll down to halfway
        await page.mouse.wheel({ deltaY: lerp(0, scrollDistance, halfwayPoint) });
        await page.waitForTimeout(scrollInterval);

        // Wait at the bottom for 2 seconds
        await page.waitForTimeout(pauseDuration);

        // Scroll up to the top
        await page.mouse.wheel({ deltaY: lerp(scrollDistance, 0, halfwayPoint) });
        await page.waitForTimeout(scrollInterval);

        // Wait at the top for 2 seconds
        await page.waitForTimeout(pauseDuration);
    }
}

async function scrapeProduct() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto(`https://shareus.io/oXpETY`, { waitUntil: 'load', timeout: 60000 });
        console.log('Page loaded successfully');
        // await page.waitForTimeout(10000);
        // Extract product handles
        const productHandles = await page.$$(".trc_rbox_outer");

        // Extracting all links
        let links = [];

        for (let productHandle of productHandles) {
            const productLinks = await productHandle.$$eval('a', (elements) =>
                elements.map(element => ({
                    href: element.href || '', // Use empty string as fallback
                }))
            );

            links = links.concat(productLinks);
        }

        const loadedLinks = links.filter(link => link.href.trim() !== '');

        const uniqueLinks = Array.from(new Set(loadedLinks.map(link => link.href)))
            .map(href => {
                return loadedLinks.find(link => link.href === href);
            });

        // Ensure that uniqueLinks is not empty
        if (uniqueLinks.length > 0) {
            // const currentLink = uniqueLinks[Math.floor(Math.random() * uniqueLinks.length)];
            const currentLink = uniqueLinks[0];
            if (currentLink && currentLink.href) {
                await clickLink(page, '.item-thumbnail-href');

                // Wait for the new tab to open
                const [newTab] = await Promise.all([
                    browser.waitForTarget(target => target.opener() === page.target()).then(target => target.page()),
                    page.waitForTimeout(5000), // Adjust the wait time as needed
                ]);

                // Navigate to the link in the new tab
                await newTab.goto(currentLink.href, { waitUntil: 'networkidle2', timeout: 10000 });

                // Scroll in the new tab for 10 seconds
                await fastUpDownScroll(newTab, 10);

                // Close the new tab
                await newTab.close();



                // const newTab = await browser.newPage();



                // await newTab.goto(currentLink.href, { waitUntil: 'networkidle2', timeout: 10000 });
                // await newTab.waitForTimeout(500);
                // await fastUpDownScroll(newTab, 10);
                // await newTab.waitForTimeout(500);
                // await newTab.close();
                console.log('Clicked on a link, scrolled, and closed tab');
            } else {
                console.log('currentLink.href is undefined or empty');
            }
        
            

// ...

        } else {
            console.log('uniqueLinks is empty');
        }
        

        // Navigate back to the main page
        await page.bringToFront();

        // Click on the element with the specified class
        const button = await page.$('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeLarge.MuiButton-textSizeLarge.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeLarge.MuiButton-textSizeLarge.css-8xntea');
        if (button) {
            await Promise.all([
                button.click(),
                page.waitForNavigation({ waitUntil: 'load', timeout: 60000 })
            ]);
            console.log('Button clicked successfully');
        }


    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        // // Close the browser
        await browser.close();
        console.log('Browser closed');
    }
}

scrapeProduct();


