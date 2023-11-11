const express = require('express')
const router = express.Router()

const user = require('./user')
router.use('/users', user)

const host = require('./host')
router.use('/host', host)

module.exports = router


