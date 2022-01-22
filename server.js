require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')



const authRoute = require('./routes/auth')

mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUniFiedTopology: true })

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Databse Connection Established !!')
})

const app = express()

app.use(morgan('dev'))
app.use(express.urlencoded())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api', authRoute)