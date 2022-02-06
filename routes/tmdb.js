const express = require('express'); //import express

// 1.
const router  = express.Router(); 
// 2.
const tmdbController = require('../controllers/tmdb');

router.get('/popular/:page', tmdbController.getPopularByPage)
router.get('/trending/:media_type/:time_window', tmdbController.getTrending)
router.get('/movie/:id', tmdbController.getMovieById)
router.get('/tv/:id', tmdbController.getTVById)
router.get('/search/:media_type/:query/:page', tmdbController.getResultsByQuery)


module.exports = router
