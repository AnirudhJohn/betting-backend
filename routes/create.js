const express = require('express')
const router = express.Router()

const masterCreator = require('../controllers/createUsers')


router.post('/creator', masterCreator.registerCreator)

module.exports = router