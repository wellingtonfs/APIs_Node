import cheerio from "cheerio"
import fetch from "node-fetch";

async function main() {
    try {
        let ini = performance.now()

        let response = await fetch("https://www.youtube.com/watch?v=DYed5whEf4g")

        let body = await response.text()

        const $ = cheerio.load(body);

        let title = $('[name="title"]')

        if (!title['0'] || !title['0'].attribs.content)
            return;

        let id = $('[itemprop="videoId"]')
        let img = $('[property="og:image"]')
        let duration = $('[itemprop="duration"]')

        title = title['0'].attribs.content

        if (id['0'])
            id = id['0'].attribs.content
        if (img['0'])
            img = img['0'].attribs.content
        if (duration['0'])
            duration = duration['0'].attribs.content

        console.log({
            id,
            title,
            img,
            duration
        })

        console.log(`\nlevou ${(performance.now() - ini) / 1000} segundos`)


        //console.log(elemento)
        //elemento.each((i, e) => console.log(e.attribs)) //e.attribs

        // const $ = cheerio.load(response.body);

        // let elemento = $('ytd-video-renderer')

        // console.log(elemento)

    } catch (e) {
        console.log(e)
    }
}

main()

// id: item['id'],
// title: decode(item['snippet']['title']),
// img: item['snippet']['thumbnails']['default']['url'],
// background: this.getMaxRes(item['snippet']),
// duration: this.getDuration(item['contentDetails']['duration'])

// const response = await got(`https://www.youtube.com/watch?v=${videoId}`);

//         const $ = cheerio.load(response.body);

//         let elemento = $('[name="twitter:title"]')

//         if (elemento['0'])
//             return {
//                 name: elemento['0'].attribs.content
//             }

//         return null