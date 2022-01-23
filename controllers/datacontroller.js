const Users = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const jwt_decode = require('jwt-decode')

// Every function in this module 
// require authentication token.
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

// It additionally requires 'to' parameter to whom send the money
const sendMoney = (req, res, next) => {

    Users.findOne({ username: req.headers.username }, (err, sdata) => {
        if (err) {
            return res.json({
                messgae: 'An error Occured',
                err
            })
        } else {


            Users.findOne({ username: req.body.to }, (err, rdata) => {
                if (rdata === null) {
                    return res.json({
                        messgae: "User Doesn't exist",

                    })
                } else {
                    const check = (n) => {
                        return n === req.body.to
                    }
                    if (sdata['wallet'] < req.body.amount) {
                        return res.json({
                            message: 'Not enough Balance in your account !!'
                        })
                    }
                    if (req.body.to === sdata['child'].find(check) || rdata['username'] === sdata['parent']) {
                        rdata.wallet = parseInt(rdata.wallet) + parseInt(req.body.amount);
                        sdata.wallet = parseInt(sdata.wallet) - parseInt(req.body.amount);
                        rdata.save();
                        sdata.save()
                        return res.json({
                            message: 'Amount Sent !!',
                            amount: req.body.amount,
                            sender: req.headers.username,
                            reciever: req.body.to
                        })
                    } else {
                        return res.json({
                            message: 'No Direct Relationship to User'
                        })
                    }

                }
            })
        }
    })



}

module.exports = {
    getWallet,
    sendMoney
}