const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true })


const TokenSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Transaction = mongoose.model('transactions', TransactionSchema)
const Token = mongoose.model('tokens', TokenSchema)
module.exports = {
    Transaction,
    Token
}