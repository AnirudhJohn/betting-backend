const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: Number,
    role: {
        type: String,
        required: true,
    },
    child: [String],
    parent: String
}, { timestamps: true })

const Users = mongoose.model('all-users', UserSchema)


module.exports = Users