const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const authMiddleware = require('../middleware/auth')


router.use('/authenticated/getInfo', authMiddleware.verifyToken)

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/info', userController.getUserInfo)


router.post('/authenticated/getInfo', userController.getAuthenticatedUserInfo)




module.exports = router