const Path = require('./path')
const fs = require('fs')

function list(pasta) {
    let folders = []

    try {
        if (!fs.existsSync(Path.dirData)) folders

        folders = fs.readdirSync(Path.dirData, { withFileTypes: true })
            .filter(file => {
                if (pasta) return file.isDirectory()
                return !file.isDirectory()
            })
            .map(file => file.name)
    } catch (e) {
        console.log(e)
    }
    
    return folders
}

const funcsFolder = {
    listdirs: function() {
        return list(true)
    },
    listfiles: function() {
        return list(false)
    }
}

module.exports = funcsFolder