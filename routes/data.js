const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const DataController = require('../controllers/datacontroller')

const isAuthenticated = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.sendStatus(403)
    } else {
        token = req.headers['authorization'].split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, async(err, authData) => {
            if (err) {
                return res.json({
                    message: 'An error Occurred',
                    err
                })
            } else {
                req.headers.username = authData['data']['name']
                next()
            }
        })
    }
}

// GET ROUTES
router.get('/wallet', isAuthenticated, DataController.getWallet)
router.get('/getchild', isAuthenticated, DataController.getChild)

// POST ROUTES
router.post('/sendmoney', isAuthenticated, DataController.sendMoney)


module.exports = router