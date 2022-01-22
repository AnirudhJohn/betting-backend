const { Watcher, Creator, Admin } = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')

const registerCreator = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        let user = new Creator({
            username: req.body.username,
            password: hashedPassword,
            wallet: 0,

        })
        user.save()
            .then(user => {
                return res.json({
                    message: 'Creater added sucessfully'
                })
            })
            .catch(error => {
                return res.json({
                    message: 'an error ocurred while creating Creator'
                })
            })
    })
}

const registerAdmin = (req, res, next) => {

}

module.exports = {
    registerCreator,
    registerAdmin
}