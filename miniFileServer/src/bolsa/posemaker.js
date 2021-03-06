//import fs from "fs"
import PoseMaker from "./spawn.js"

async function MakePose(data) {
    const people = data.data.people.at(0)

    //let keys = Object.keys(people).filter(key => key.includes('2d'))

    try {
        const res =  await PoseMaker({
            pose: people["pose_keypoints_2d"],
            face: people["face_keypoints_2d"],
            hand_left: people["hand_left_keypoints_2d"],
            hand_right: people["hand_right_keypoints_2d"],
            linewidth: data.linewidth
        })

        //fs.writeFileSync("out.bin", res)

        return res
    } catch (e) {
        console.log(e)
        return null
    }

    //console.log(keys.at(1))
    //console.log(people[keys.at(1)].length)

    //console.log(people[keys.at(1)].slice(0).join(' '))
}

// let data = JSON.parse(fs.readFileSync("1_keypoints.json"))

// let ini = performance.now();

// (async function () {
//     for (let i = 1; i <= 64; i++) {
//         getPose({
//             linewidth: 15,
//             data: data
//         })
//         console.log(i)
//     }
        

//     //console.log(`\nlevou ${(performance.now() - ini) / 1000} segundos`)
// })()

// process.on("exit", () => {
//     console.log(`\nlevou ${(performance.now() - ini) / 1000} segundos`)
// })

export default MakePose