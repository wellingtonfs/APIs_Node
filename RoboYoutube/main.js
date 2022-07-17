const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://youtube.com');

    await page.type('[name="search_query"]', "Natural - Imagine Dragons", { delay: 0 })
    await page.click("#search-icon-legacy")

    await page.waitForSelector("ytd-video-renderer")

    const resp = await page.evaluate(() => {
        let dados = document.querySelectorAll("ytd-video-renderer")
        let links = []

        for (let i = 0; i < dados.length; i++) {
            links.push([dados[i].querySelector("#video-title").title, dados[i].querySelector("#video-title").href])
        }

        return links
    })

    console.log(resp)

    await browser.close();
}

main()