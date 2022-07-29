import puppeteer from "puppeteer"

async function main() {
    const browser = await puppeteer.launch({ headless: true });

    let ini = performance.now()

    const page = await browser.newPage();
    await page.goto('https://www.youtube.com/watch?v=0I647GU3Jsc');

    // await page.type('[name="search_query"]', "Natural - Imagine Dragons", { delay: 0 })
    // await page.click("#search-icon-legacy")

    await page.waitForSelector("ytd-compact-video-renderer .details a span")

    const resp = await page.evaluate(async () => {
        const wait = () => new Promise((res) => setTimeout(res, 100))

        let dados = document.querySelectorAll("ytd-compact-video-renderer .details a")
        let count = 0

        while (dados.length < 8 && count < 10) {
            await wait()

            dados = document.querySelectorAll("ytd-compact-video-renderer .details a")
            count += 1
        }

        let links = []

        for (let i = 0; i < dados.length; i++) {
            const span = dados[i].querySelector('span')

            if (typeof span == 'undefined') break;

            links.push({
                title: span.title,
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