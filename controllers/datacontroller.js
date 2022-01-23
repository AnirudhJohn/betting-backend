const Users = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const jwt_decode = require('jwt-decode')

const getWallet = (req, res, next) => {

    Users.findOne({ username: req.headers.username }, (err, data) => {

        if (err) {
            return res.json({
                messgae: 'An error Occured',
                err
            })
        } else {
            return res.json({
                wallet: data.wallet
            })
        }
    })
}

module.exports = {
    getWallet
}