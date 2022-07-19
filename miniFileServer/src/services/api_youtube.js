import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import { decode } from 'html-entities';

import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

class ApiYoutube {
    static API_URL = "https://www.googleapis.com/youtube/v3"

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
        let url = `${ApiYoutube.API_URL}/videos?id=${videoId}&key=${process.env.API_KEY}&part=snippet&fields=items(snippet)`

        try {
            let response = await fetch(url)
            response = await response.json()

            if (response["items"].length == 0) return null

            let title = response["items"][0]['snippet']['title']

            return {
                name: decode(title)
            }

        } catch (error) {
            console.log(error)
            return null
        }
    }

    async getResults(frase) {
        let pesquisa = frase.trim().replace(/ /g, '+').replace(/\//g, '')

        let url = `${ApiYoutube.API_URL}/search?q=${pesquisa}&key=${process.env.API_KEY}&maxResults=10&part=snippet&fields=items(id,snippet)`

        try {
            let response = await fetch(url)
            response = await response.json()

            //console.log(response["items"][0]['snippet']['title'])

            let td = response["items"].map(item => { return {
                id: item['id']['videoId'],
                title: decode(item['snippet']['title']),
            }})

            return {
                videos: td
            }

        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default new ApiYoutube()