const express = require('express')
const rota = express.Router()

const User = require('../models/Usuario')
const Path = require('../util/path')
const objArq = require('../util/objectFile')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fs = require('fs')

const config = require('../config/auth.json')

function gerarToken(obj = {}) {
    return jwt.sign(obj, config.secretkey, { expiresIn: '1d' })
}

rota.post('/register', async (req, res) => {
    const { name, nick, email, password } = req.body
    
    try {
        if (!name || !nick || !email || !password)
            return res.status(400).send({ error: 'Data not provided' })
        else if (await User.findOne({ nick }))
            return res.status(400).send({ error: 'Nickname already registered' })
        else if (await User.findOne({ email }))
            return res.status(400).send({ error: 'E-mail already registered' })
        else if (password.length < 3)
            return res.status(400).send({ error: 'Password too short' })

        const pathroot = Path.join([Path.dirData, nick])

        const user = await User.create({
            name, nick, email, password, root: pathroot,
            files: new objArq(nick, 'p', '', null, true)
        })

        if (fs.existsSync(pathroot))
            fs.renameSync(
                pathroot,
                Path.join([
                    Path.dirData,
                    'backup_' + Date.now() + '_' + user.nick
                ])
            )
            
        fs.mkdirSync(pathroot)

        return res.send({
            name, nick, email,
            token: gerarToken({ id: user.id }),
        })

    } catch (err) {
        return res.status(400).send({error: 'Registration failed'})
    }
})

rota.post('/login', async (req, res) => {
    try{
        if ((! ('nick' in req.body) && ! ('email' in req.body)) || ! ('password' in req.body)){
            return res.status(400).send({ error: 'Authentication error' })
        }

        if ('nick' in req.body)
            var user = await User.findOne({ nick: req.body.nick }).select('+password');
        else
            var user = await User.findOne({ email: req.body.email }).select('+password');

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        if (!await bcrypt.compare(String(req.body.password), user.password))
            return res.status(400).send({ error: 'Invalid password'})

        return res.json({
            token: gerarToken({ id: user.id })
        })

    } catch ( err ) {
        return res.status(400).send({ error: 'Invalid request' })
    }
})

rota.post('/forgotpassword', async (req, res) => {
    const { nick, email } = req.body

    try {
        if (typeof email != "undefined") 
            var user = await User.findOne({ email })
        else if(typeof nick != "undefined") 
            var user = await User.findOne({ nick })
        else
            return res.status(400).send({ error: 'email/nickname not provided!' })

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        const hex = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setMinutes(now.getMinutes() + 30)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                tokenNewPassword: hex,
                tokenNewPasswordExpirationTime: now
            }
        })

        return res.send({hex, now})
        
    } catch (err) {
        return res.status(400).send({ error: 'Unknown error' })
    }
})

rota.put('/newpassword', async (req, res) => {
    const { token, nick, email, password } = req.body

    if (typeof token == "undefined" || typeof password == "undefined")
        return res.status(400).send({ error: 'Token or password not provided!' })

    try {
        if (typeof email != "undefined") 
            var user = await User.findOne({ email }).select('+tokenNewPassword tokenNewPasswordExpirationTime')
        else if(typeof nick != "undefined") 
            var user = await User.findOne({ nick }).select('+tokenNewPassword tokenNewPasswordExpirationTime')
        else
            return res.status(400).send({ error: 'email/nickname not provided!' })

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        if (password.length < 3)
            return res.status(400).send({ error: 'Password too short' })

        if (user.tokenNewPassword != token)
            return res.status(400).send({ error: 'Token invalid' })

        if (Date.now() >= user.tokenNewPasswordExpirationTime)
            return res.status(400).send({ error: 'Token expired' })

        user.password = password

        await user.save()

        return res.send()
    } catch (err) {
        return res.status(400).send({ error: 'Unknown error' })
    }
})

module.exports = rota