require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

// Importing local paths
const authRoute = require('./routes/auth')
const { token } = require('morgan')
const Users = require('./models/User')

// Database Stuff
mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUniFiedTopology: true })
const db = mongoose.connection
db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Databse Connection Established !!')
})

// App Config statements 
const app = express()
app.use(morgan('dev'))
app.use(express.urlencoded())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Port Variable
const PORT = process.env.PORT || 3000

// Server Listener 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Routes
app.use('/api', authRoute)
app.get('/', (req, res) => res.redirect('/api'))
app.post('/', (req, res) => {
    let token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {

            Users.findOne({ username: authData['data']['name'] }, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    if (req.body.name) {
                        data.child.push("alex")
                    }
                    data.save();
                    res.json({
                        message: data
                    })
                }
            })
        }
    })
})