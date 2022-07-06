const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs")

const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    root: {
        type: String,
        required: true,
        unique: true
    },
    files: [{
        type: Object
    }],
    tokenNewPassword: {
        type: String,
        select: false
    },
    tokenNewPasswordExpirationTime: {
        type: Date,
        select: false
    },
    created: {
        type: Date,
        default: Date.now
    }
})

UsuarioSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(String(this.password), 10)
    this.password = hash
    next()
})

const User = mongoose.model('User', UsuarioSchema)

module.exports = User;
