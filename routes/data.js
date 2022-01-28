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
                req.headers.role = authData['data']['role']
                next()
            }
        })
    }
}

// GET ROUTES
router.get('/wallet', isAuthenticated, DataController.getWallet)
router.get('/getchild', isAuthenticated, DataController.getChild)
router.get('/valid', DataController.valid)
router.get('/gettrans', isAuthenticated, DataController.getTransactions)
router.get('/isvaliduser', isAuthenticated, DataController.isvaliduser)

router.get('/one', DataController.one)

// POST ROUTES
router.post('/sendmoney', isAuthenticated, DataController.sendMoney)
router.post('/removeuser', isAuthenticated, DataController.removeuser)
router.post('/gencoin', isAuthenticated, DataController.genCoin)
router.post('/transfer', isAuthenticated, DataController.transfer)
router.post('/getchilddata', isAuthenticated, DataController.getchilddata)


router.put('/block', isAuthenticated, DataController.block)


module.exports = router