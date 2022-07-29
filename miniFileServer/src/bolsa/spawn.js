import path from "path"
import { spawn } from "child_process"
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathToPythonScript = path.join(__dirname, "posemaker.py")

export default function PoseMaker(jsondata) {
    return new Promise((res, reject) => {
        const child = spawn(
            "python3",
            [
                pathToPythonScript,
                "1080",
                "1920",
                "--pose", ...jsondata.pose,
                "--face", ...jsondata.face,
                "--hand_left", ...jsondata.hand_left,
                "--hand_right", ...jsondata.hand_right,
                "--linewidth", jsondata.linewidth
            ]
        )
        
        child.stdout.on("data", (data) => {
            res(data.toString().replace(/\n$/, ''))
        })
        
        child.on("error", (error) => {
            reject(error)
        })
    })
}