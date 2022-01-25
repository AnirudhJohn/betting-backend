const Users = require('../models/User')
const Transactions = require('../models/transaction')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const jwt_decode = require('jwt-decode')

// Every function in this module 
// require authentication token.
const getWallet = (req, res, next) => {
    console.log('here')
    Users.findOne({ username: req.headers.username }, (err, data) => {

        if (err) {
            return res.json({
                messgae: 'An error Occured',
                err
            })
        } else {
            console.log(data)
            return res.json({

                wallet: data.wallet,
                username: data.username,
                role: data.role
            })
        }
    })
}

// It additionally requires 'to' parameter to whom send the money
const sendMoney = (req, res, next) => {
    console.log(req.headers.username)
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
                        sdata.save();
                        let transaction = new Transactions({
                            sender: sdata['username'],
                            receiver: rdata['username'],
                            amount: req.body.amount,
                        })

                        transaction.save();
                        return res.json({
                            message: 'Amount Sent !!',
                            amount: req.body.amount,
                            sender: req.headers.username,
                            reciever: req.body.to,
                            transaction
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

const getChild = (req, res, next) => {

    Users.findOne({ username: req.headers.username }, (err, data) => {


        children = data['child']
        a = JSON.stringify(children)
        console.log(typeof children, typeof a)
        console.log(a)
        console.log(children)
        for (const child in children) {
            console.log(`${child} : ${children[child]}`)
        }


        console.log(children)
        return res.json({
            children
        })
    })
}

const valid = (req, res, next) => {
    return res.send
}

module.exports = {
    getWallet,
    sendMoney,
    getChild,
    valid
}