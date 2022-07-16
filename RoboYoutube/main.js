const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://youtube.com');

    //await page.waitForNavigation()

    await page.type('[name="search_query"]', "Natural - Imagine Dragons", { delay: 100})
    await page.click("#search-icon-legacy")

    await page.evaluate(() => {
        document.querySelectorAll("ytd-video-renderer yt-interaction")[2].click()
    })

    await page.waitForNavigation()

    //console.log(resp)

    //await browser.close();
}

main()