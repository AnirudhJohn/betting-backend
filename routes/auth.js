const express = require('express')
const router = express.Router()
const isAuthenticated = require('./data')
const AuthController = require('../controllers/authController')

router.get('/', (req, res) => res.json({
    message: 'API working correctly'
}))
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

module.exports = router