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
    }

}, { timestamps: true })

const CreatorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unque: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: Number,
    childAdmin: []
}, { timestamps: true })

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unque: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: Number,
    parent: String,
    childSMDL: []
}, { timestamps: true })






const Watcher = mongoose.model('watcher', UserSchema)
const Creator = mongoose.model('creator', CreatorSchema)
const Admin = mongoose.model('admin', AdminSchema)
module.exports = {
    Watcher: Watcher,
    Creator: Creator,
    Admin: Admin
}