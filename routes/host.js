const express = require('express')
const router = express.Router()


const {addHost, getHost, updateHost, deleteHost, mainHost, hostType, allFilter} = require('../controllers/host')
const {checkToken} = require('../middlewares/auth')
const hostValidations = require('../middlewares/validations/host.validations')
const upload = require('../middlewares/lib/multer')

router.get('/filter', allFilter)
router.get('/main', mainHost)
router.get('/:type', hostType)

router.get('/:id', getHost)
router.post('/', checkToken, upload.array('image',10), hostValidations, addHost)
router.put('/:id', checkToken, upload.array('image', 10), updateHost)
router.delete('/:id', checkToken, deleteHost)


module.exports = router