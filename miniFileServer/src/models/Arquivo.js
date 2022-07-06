const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ArquivoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dir: {
        type: String,
        required: true
    },
    files: [{
        type: Object,
        required: true
    }],
    maxSize: {
        type: Number
    },
    currentSize: {
        type: Number
    }
})

const Arquivo = mongoose.model('Arquivo', ArquivoSchema)

module.exports = Arquivo;
