const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
        if (err) {
            return res.json({
                error: err,
                message: req.body
            })
        }
        let user = new User({
            username: req.body.username,
            password: hashedpassword
        })
        user.save()
            .then(user => {
                return res.json({
                    message: 'User added Succesfully...'
                })
            })
            .catch(error => {
                return res.json({
                    message: 'An error occured! '
                })
            })
    })
}

const login = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({ username: username })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        return res.json({
                            message: 'Login Successfull ..',
                            token: token
                        })
                    } else {
                        return res.json({
                            message: 'Password Does not matched !'
                        })
                    }
                })
            } else {
                return res.json({
                    message: 'No User Found !!'
                })
            }
        })
}




module.exports = {
    register,
    login
}