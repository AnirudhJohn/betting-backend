const Users = require('../models/User')
const { Transaction, Token } = require('../models/transaction')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const jwt_decode = require('jwt-decode')
const requests = require('requests')

// Every function in this module 
// require authentication token.
const getWallet = (req, res, next) => {
    console.log('here')
    Users.findOne({ username: req.headers.username }, (err, data) => {

        if (err) {
            console.log('i am here');
            return res.json({
                messgae: 'An error Occured',
                err
            })
        } else {
            console.log(data)
            console.log('i am here');
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
            console.log('i am here');
            return res.json({
                messgae: 'An error Occured',
                err
            })
        } else {


            Users.findOne({ username: req.body.to }, (err, rdata) => {
                if (rdata === null) {
                    console.log('i am here');
                    return res.json({
                        messgae: "User Doesn't exist",

                    })
                } else {
                    const check = (n) => {
                        console.log('i am here');
                        return n === req.body.to
                    }
                    if (sdata['wallet'] < req.body.amount) {
                        console.log('i am here');
                        return res.json({
                            message: 'Not enough Balance in your account !!'
                        })
                    }
                    if (req.body.to === sdata['child'].find(check) || rdata['username'] === sdata['parent']) {
                        rdata.wallet = parseInt(rdata.wallet) + parseInt(req.body.amount);
                        sdata.wallet = parseInt(sdata.wallet) - parseInt(req.body.amount);
                        rdata.save();
                        sdata.save();
                        let transaction = new Transaction({
                            sender: sdata['username'],
                            receiver: rdata['username'],
                            amount: req.body.amount,
                        })

                        transaction.save();
                        console.log('i am here');
                        return res.json({
                            message: 'Amount Sent !!',
                            amount: req.body.amount,
                            sender: req.headers.username,
                            reciever: req.body.to,
                            transaction
                        })
                    } else {
                        console.log('i am here');
                        return res.json({
                            message: 'No Direct Relationship to User'
                        })
                    }

                }
            })
        }
    })



}
let money = []

const getChild = (req, res, next) => {
    money = []

    Users.findOne({ username: req.headers.username }, (err, data) => {

        console.log(data)
        children = data['child']
        parent = data['parent']

        if (children === null) {
            console.log('i am here');
            return res.json({
                message: 'no children'
            })
        } else {
            if (req.headers.role === 'creator') {

                console.log('children', children)
                console.log('money', money)
                return res.json({
                    data

                })
            } else if (req.headers.role === 'user') {
                console.log('i am here');
                return res.json({
                    children: data['parent']
                })

            } else {
                console.log('i am here');
                return res.json({
                    children,
                    parent
                })
            }
        }


    })
}

const getchilddata = (req, res, next) => {
    console.log(req.body)
    Users.findOne({ username: req.body.username }, (err, data) => {
        if (err) {
            res.sendStatus(500)
        } else {
            return res.json({
                data
            })
        }
    })
}
const removeuser = (req, res, next) => {


    Users.findOne({ username: req.headers.username }, (err, data) => {
        if (err) {
            console.log('in err', err)
            console.log('i am here');
            return res.sendStatus(500)
        } else {
            console.log('old data', data['child'])
            children = data['child']
            if (children.indexOf(req.body.username) === -1) {
                console.log('no parent found')
            } else {

                children.splice(children.indexOf(req.body.username), 1)
            }
            console.log('new data', children)
            data['child'] = children
            data.save()

            console.log('i am here');
            return res.sendStatus(200)
        }
    })
    Users.findOne({ username: req.body.username }, (err, data) => {
        if (err) {
            console.log(err)
            console.log('i am here');
            return res.sendStatus(404)
        } else {

            Users.findOneAndDelete({ username: req.body.username }, (err, data) => {
                if (err) {
                    console.log('haan me error hu')
                    console.log(err)

                    res.sen(403)
                } else {
                    console.log(req.body)
                    console.log('User deleted !!')

                }

            })
        }
    })
}

const valid = (req, res, next) => {
    if (!req.headers['authorization']) {
        console.log('i am here');
        return res.sendStatus(403)
    } else {
        token = req.headers['authorization'].split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, async(err, authData) => {
            if (err) {
                console.log('i am here');
                return res.send(false)
            } else {
                console.log('i am here');
                return res.send(true)
            }
        })
    }

}
const genCoin = (req, res, next) => {
    if (req.headers.role === 'creator') {
        Users.findOne({ username: req.headers.username }, (err, data) => {
            if (err) {
                console.log('i am here');
                return res.sendStatus(500)
            } else {
                data['wallet'] = data['wallet'] + req.body['ammount']
                data.save()
                console.log('making entry...')
                let token = new Token({
                    creator: req.headers.username,
                    amount: req.body['ammount']
                })
                token.save();
                console.log('i am here');
                return res.sendStatus(200)
            }
        })
    } else {
        console.log('i am here');
        return res.sendStatus(403)
    }
}
const transfer = (req, res, next) => {
    const sender = req.headers.username
    const recevier = req.body['rec']
    const amount = req.body['amount']['amount']

    Users.findOne({ username: sender }, (err, data) => {
        if (data['wallet'] < amount) {
            res.sendStatus(403)
        }

        children = data['child']
        if (children === null) {
            console.log('i am here');
            return res.json({
                message: 'no children'
            })
        } else {
            if (data['child'].includes(recevier) || data['parent'] === recevier) {
                Users.findOne({ username: recevier }, (err, rdata) => {
                    if (err) {
                        console.log('i am here');
                        return res.sendStatus(500)
                    } else {
                        if (amount < data['wallet']) {
                            console.log(rdata['wallet'], data['wallet'], amount)
                            rdata['wallet'] += amount;
                            data['wallet'] -= amount
                            console.log(rdata['wallet'], data['wallet'], amount)
                            data.save()
                            rdata.save()
                            let transaction = new Transaction({
                                sender: data['username'],
                                receiver: rdata['username'],
                                amount: amount,
                            })

                            transaction.save();

                        } else {
                            console.log('i am here');
                            console.log('i am here');
                            return res.sendStatus(403)
                        }
                    }
                })
            }

        }


    })


    console.log('send ' + amount + ' from ' + sender + ' to ' + recevier)

    console.log('i am here');
    return res.sendStatus(200)
}

const getTransactions = (req, res, next) => {
    console.log('hii')
    const username = req.headers.username
    Transaction.find({ sender: username }, (err, data) => {
        if (err) {
            console.log('i am here');
            return res.sendStatus(500)
        } else {
            console.log('i am here');
            return res.json(data)
        }

    })
}

const isvaliduser = (req, res, next) => {
    Users.findOne({ usernme: req.body.username }, (err, data) => {
        if (err) {
            return res.sendStatus(403)
        } else {
            console.log(data['isActive'])
            return res.send(data['isActive'])
        }
    })

}

const one = (req, res, next) => {
    requests(process.env.API_ONE, (err, response, body) => {
        console.log(err, body, response)
        res.sendStatus(200)
    })

}

module.exports = {
    getWallet,
    sendMoney,
    getChild,
    valid,
    removeuser,
    genCoin,
    transfer,
    getTransactions,
    isvaliduser,
    getchilddata,
    one
}



// for (let i = 0; i < children.length; i++) {
//     Users.findOne({ username: children[i] }, (err, data) => {
//         if (err) {
//             return res.sendStatus(500)
//         } else {
//             money.push(data['wallet'])
//             console.log(data['wallet'])
//         }
//     })
// }