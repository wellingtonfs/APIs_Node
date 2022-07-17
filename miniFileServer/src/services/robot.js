import puppeteer from "puppeteer"
import cheerio from "cheerio"
import got from "got"

class MyRobot {
    constructor() {
        this.browser = null
        this.page = null

        this.start()
        this.getVideoId = this.getVideoId.bind(this)
    }

    async start() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });

        this.page = await this.browser.newPage();
        await this.page.exposeFunction("getVideoId", this.getVideoId);
    }

    getVideoId(url) {
        let lookFor = "watch?v="
        let indexInit = url.indexOf(lookFor) + lookFor.length
        let indexEnd = url.length

        if (url.includes("&list=")) {
            lookFor = "&list="
            indexEnd = url.indexOf(lookFor)
        }

        return url.slice(indexInit, indexEnd)
    }

    async getVideoName(videoId) {
        const response = await got(`https://www.youtube.com/watch?v=${videoId}`);

        const $ = cheerio.load(response.body);

        let elemento = $('[name="twitter:title"]')

        if (elemento['0'])
            return {
                name: elemento['0'].attribs.content
            }

        return null
    }

    async getResults(frase) {
        if (this.page === null) return null

        let url = `https://www.youtube.com/results?search_query=${frase.trim().replace(/ /g, '+')}`

        await this.page.goto(url);

        // await this.page.type('[name="search_query"]', frase)
        // await this.page.click("#search-icon-legacy")
    
        await this.page.waitForSelector("ytd-video-renderer")
    
        let resp = await this.page.evaluate(async () => {
            let dados = document.querySelectorAll("ytd-video-renderer")
            let links = {}
    
            for (let i = 0; i < dados.length; i++) {
                let title = dados[i].querySelector("#video-title").title
                let linkvideo = dados[i].querySelector("#video-title").href

                linkvideo = await getVideoId(linkvideo)

                links[title] = { 
                    preview: `/api/youtube/convert/${linkvideo}`,
                    download: `/api/youtube/get/${linkvideo}`
                }
            }
    
            return links
        })

        return resp
    }

    async close() {
        await this.browser.close()
    }
}

export default new MyRobot()