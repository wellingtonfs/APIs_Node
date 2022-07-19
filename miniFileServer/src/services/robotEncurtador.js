import puppeteer from "puppeteer"

export default async function getShortUrl(url) {
    let browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });

    let context = await browser.createIncognitoBrowserContext()
    let page = await context.newPage()

    await page.goto("https://www.rebrandly.com");

    await page.type('#url', url)
    await page.click("#wf-form-rebrand-link-form > button")

    await page.waitForSelector(".short-link a")

    let resp = await page.evaluate(async () => {
        if (document.querySelector(".short-link a") !== null) {
            return document.querySelector(".short-link a").href
        }

        return null
    })

    await context.close()
    await browser.close()

    return resp
}
