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

const Transaction = mongoose.model('transactions', TransactionSchema)

module.exports = Transaction