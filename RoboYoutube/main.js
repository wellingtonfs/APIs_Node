import puppeteer from "puppeteer"

async function main() {
    const browser = await puppeteer.launch({ headless: false });

    let ini = performance.now()

    const page = await browser.newPage();
    await page.goto('https://www.youtube.com/results?search_query=Imagine+dragons+-+Natural');

    // await page.type('[name="search_query"]', "Natural - Imagine Dragons", { delay: 0 })
    // await page.click("#search-icon-legacy")

    await page.waitForSelector("ytd-video-renderer")

    const resp = await page.evaluate(() => {
        let dados = document.querySelectorAll("ytd-video-renderer #video-title")
        
        let links = []

        for (let i = 0; i < dados.length; i++) {
            links.push({
                title: dados[i].title,
                link: dados[i].href,
                //duration: tempos[i].textContent.replace(/\\n/g, '').trim()
            })
        }

        return links
    })

    console.log(resp)

    console.log(`\nlevou ${(performance.now() - ini) / 1000} segundos`)

    await browser.close();
}

main()

//ytd-thumbnail-overlay-time-status-renderer

//document.querySelectorAll("ytd-video-renderer ytd-thumbnail-overlay-time-status-renderer span, ytd-video-renderer #video-title")