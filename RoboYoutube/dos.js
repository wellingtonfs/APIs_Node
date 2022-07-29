import fetch from "node-fetch";
import process from 'node:process';

let ini = performance.now()
let cc = 10

async function search(i) {
    let dados

    try {
        let response = await fetch("http://localhost:3006/api/youtube-robot/search", {
            method: 'POST',
            body: JSON.stringify({ frase: "imagine dragons natural" }),
            headers: {'Content-Type': 'application/json'}
        })

        dados = await response.json()
        console.log(i, ":", dados.videos[0].id)

    } catch (e) {
        console.log(i, ":", e, dados)
    }
}

for (let i = 1; i <= cc; i++) {
    search(i)
}

process.on("exit", () => {
    console.log(`\nlevou ${(performance.now() - ini) / 1000} segundos`)
})

//29 segundos