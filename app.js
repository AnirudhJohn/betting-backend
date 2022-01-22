const express = require('express')
const jwt = require('jsonwebtoken')



const app = express()

app.get('/api', (req, res) => {
    res.json({
        message: 'Api is working correctly...'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post Created',
                data: authData
            })
        }
    })


})

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'ani',
        email: 'ani@localhost.com'
    }
    jwt.sign({ user: user }, 'secretkey', { expiresIn: "1h" }, (err, token) => {
        if (err) {
            res.status(403)
        } else {
            res.json({
                token
            })
        }
    })
})

// verify token 

function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];
    console.log(req.headers)
    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();


    } else {
        res.sendStatus(403)
    }
}


app.listen(3000, () => console.log('Server listening on 3000....'))