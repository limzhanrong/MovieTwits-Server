const express = require('express')
const router = express.Router()

const listController = require('../controllers/list')
const authMiddleware = require('../middleware/auth')

// API Routes starts with "/api/list/"

// Mount middleware
router.use('/authenticated/', authMiddleware.verifyToken)

router.post('/authenticated/getLists', listController.getAuthenticatedUserLists)
router.post('/authenticated/retrieveListsWithFilmIdExistance', listController.retrieveListsWithFilmIdExistance)
router.post('/authenticated/toggleShowFromWatchlist', listController.toggleShowFromWatchlist)
router.post('/authenticated/create', listController.createList)
router.post('/authenticated/delete', listController.deleteList)

// Routes that do not need authentication
router.get('/public/:username/getLists', listController.getListsByUsername)
router.get('/public/getMediaFromWatchlist/:listID', listController.getMediaFromWatchlist)
router.get('/public/:id', listController.getListById)



module.exports = router