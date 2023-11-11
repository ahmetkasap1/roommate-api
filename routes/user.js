const express = require('express')
const router = express.Router()

const userControllers = require('../controllers/user')
const authValidations = require('../middlewares/validations/auth.validations')
const authMiddlewares = require('../middlewares/auth')

const upload = require('../middlewares/lib/multer')

router.post('/register', authValidations.register, userControllers.register)
router.post('/login', authValidations.login, userControllers.login)

router.get('/profile/:id',  userControllers.getProfile)
router.put('/profile', authMiddlewares.checkToken, userControllers.editProfile)
router.get('/profile/avatar/:id', userControllers.getAvatar)
router.put('/profile/avatar', authMiddlewares.checkToken, upload.array('avatar',1), userControllers.editAvatar)

router.post('/forgot-password', userControllers.forgotPassword)
router.post('/forgot-password-check', userControllers.forgotPasswordCheckCode)
router.post('/reset-password', userControllers.resetPassword)

router.post('/favorites/:id', authMiddlewares.checkToken, userControllers.addFavorite)
router.delete('/favorites/:id', authMiddlewares.checkToken, userControllers.deleteFavorite)
router.get('/favorites', authMiddlewares.checkToken, userControllers.listFavorite)



module.exports = router


