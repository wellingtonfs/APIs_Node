const Path = require('./path')

module.exports = function(nome, tipo, pai, size = null, root = false) {
    this.n = nome
    this.t = tipo
    this.p = pai
    this.s = size
    this._m = root

    if (root) this._cp = pai
    else this._cp = Path.join([pai, nome], { convertToPlatform: false })
}