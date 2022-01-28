const mongoose = require('mongoose')
const Schema = mongoose.Schema

const opts = {
    timestamps: {
        currentTime: () => {
            let d = new Date();
            let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            let nd = new Date(utc + (3600000 * +5.5));
            return nd
        }
    }
}

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
    parent: String,
    isActive: {
        type: Boolean,
        default: true
    }

}, opts)

const Users = mongoose.model('all-users', UserSchema)


module.exports = Users