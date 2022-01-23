require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

// Importing local paths
const authRoute = require('./routes/auth')
const dataRoute = require('./routes/data')
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
app.use('/api/data', dataRoute)

// Sample 
app.get('/api/one', (req, res) => res.redirect(process.env.API_ONE))
app.get('/api/two', (req, res) => res.redirect(process.env.API_TWO))
app.get('/api/three', (req, res) => res.redirect(process.env.API_THREE))
app.get('/api/four', (req, res) => res.redirect(process.env.API_FOUR))
app.get('/api/five', (req, res) => res.redirect(process.env.API_FIVE))


// API 1 : All Country List

// API 2 : All Leagues Name List

// API 3 : All Match Fixtures List

// API 4 : Livescore 

// API 5 : Odds

// just for checking and testing purposes


// headers authentication, body : to, amount
// app.post('/', (req, res) => {
//     if (!req.headers['authorization']) {
//         return res.sendStatus(403)
//     } else {
//         let token = req.headers['authorization'].split(' ')[1]
//         jwt.verify(token, process.env.JWT_SECRET, async(err, authData) => {
//             if (err) {
//                 return res.json({
//                     message: 'An error Occurred',
//                     err
//                 })
//             } else {
//                 req.headers.username = authData['data']['name']
//                 Users.findOne({ username: req.headers.username }, (err, sdata) => {
//                     if (err) {
//                         return res.json({
//                             messgae: 'An error Occured',
//                             err
//                         })
//                     } else {

//                         Users.findOne({ username: req.body.to }, (err, rdata) => {
//                             if (err) {
//                                 return res.json({
//                                     messgae: 'An error Occured',
//                                     err
//                                 })
//                             } else {
//                                 const check = (n) => {
//                                     return n === req.body.to
//                                 }
//                                 if (req.body.to === sdata['child'].find(check) || rdata['username'] === sdata['parent'])

//                                     return res.json({
//                                     message: 'Amount Sent !!',
//                                     amount: req.body.amount,
//                                     sender: req.headers.username,
//                                     reciever: req.body.to
//                                 })
//                             }
//                         })
//                     }
//                 })
//             }
//         })
//     }
// })