require('dotenv/config');

const utilsPath = {
    dirData: process.env.DIR_USER_DATA,
}

const join = function (params = [], opt = { convertToPlatform: true }){
    if (!params || params.length == 0) return ''

    //windows
    var result = params[0]
    const sep = '/'

    for(let i = 1; i < params.length; i++){
        if (!params[i]) continue

        result += (result) ? sep + params[i] : params[i]
    }

    result = result
                .replace(new RegExp('\\+|/{2,}', 'g'), '/')
                .replace(new RegExp('/+$'), '')

    if (opt.convertToPlatform)
        return useDir(result)

    return result
}

const isCorrectDir = (dir) => {
    if (/^\/+|^\\+|\.{2,}/.test(dir))
        return false

    if (/\/{2,}|\\{3,}|\/+$|\\+$/.test(dir))
        return false

    if (/^\.+|\.+$/.test(dir))
        return false

    return true
}

const isCorrectName = (name) => {
    if (/\.{2,}|\\+|\/+|^\.+|\.+$/.test(name)) {
        return false
    }

    return true
}

const normDir = (dir) => {
    return dir.replace(/\\+/g, '/')
}

const useDir = (dir) => {
    if (process.platform == 'win32')
        return dir.replace(/\/+/g, '\\')
    return dir
}

module.exports = utilsPath
module.exports.join = join
module.exports.isCorrectDir = isCorrectDir
module.exports.isCorrectName = isCorrectName
module.exports.normDir = normDir
module.exports.useDir = useDir