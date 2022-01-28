const Users = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const jwt_decode = require('jwt-decode')


// register user function 
// requires req.body.username, req.body.password, req.headers.authorization
const register = (req, res, next) => {

    Users.findOne({ username: req.body.username })
        .then(user => {
            if (user) {

                return res.sendStatus(403)
            } else {


                console.log(req.body)
                    // encrypt the password
                bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
                    if (err) {

                        return res.json({
                            error: err
                        })
                    }
                    // authorization token 
                    console.log(req.headers)
                    token = req.headers['authorization'].split(' ')[1]

                    // token verification 
                    jwt.verify(token, process.env.JWT_SECRET, async(err, authData) => {
                        if (err) {
                            console.log(err)
                            console.log(authData)
                            console.log('aaaaaaaaaa')
                            return res.json()
                        } else {

                            // Retrieve data from decoded token  
                            const prole = authData['data']['role']
                            const papa = authData['data']['name']

                            // Figure out who called the function, and what role to provide
                            let crole = newRole(prole)

                            // Create new User
                            let user = new Users({
                                username: req.body.username,
                                password: hashedpassword,
                                wallet: 0,
                                role: crole,
                                parent: papa
                            })

                            // update the parent user's child array
                            Users.findOne({ username: papa }, (err, data) => {
                                console.log(data)
                                if (err) {
                                    console.log(err)
                                } else {
                                    data.child.push(req.body.username)
                                        // Save Changes
                                    data.save();
                                }
                            })

                            // Save newly created User
                            user.save()
                                .then(user => {
                                    return res.json({
                                        message: 'User added Succesfully...',
                                    })
                                })
                                .catch(error => {
                                    return res.json({
                                        message: 'An error occured! ',
                                        error
                                    })
                                })

                        }
                    })
                })
            }
        })
}

// Login a User
// It requires req.body.username, req.body.password
const login = (req, res, next) => {

    console.log(req.body)


    // Get variables from request 
    let username = req.body.username;
    let password = req.body.password;

    // Find user in database 
    Users.findOne({ username: username })
        .then(user => {
            if (user) {

                // Compare hases 
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.sendStatus(403)
                    }
                    if (result) {
                        // Create token data with username and role
                        let data = {
                            name: user.username,
                            role: user.role
                        }

                        // Create token 
                        let token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: '900h' })

                        // Send Response
                        return res.json({
                            token
                        })
                    } else {
                        return res.sendStatus(403)
                    }
                })
            } else {
                return res.sendStatus(403)
            }
        })
}

//Function to figure out Which user called the function and what role to provide to the child user 

let newRole = function(prole) {
    switch (prole) {
        case 'creator':
            return 'admin';
        case 'admin':
            return 'supermaster';
        case 'supermaster':
            return 'submaster';
        case 'submaster':
            return 'master';
        case 'master':
            return 'user';
        default:
            return 'user';
    }
}

let duplicateUser = (username, res) => {

}

module.exports = {
    register,
    login
}