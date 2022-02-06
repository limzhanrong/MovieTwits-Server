// const { RSA_NO_PADDING } = require('constants');

require('dotenv').config();
const axios = require('axios').default;
const key = process.env.TMDB_API_KEY


// Get popular pages
const getPopularByPage = async (req,res) =>{
    const {page} = req.body
    try{
        const result =  await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=${page}`)
        res.status(200).json({
            status: 'success',
            results: result.data
        })
    }catch(error){
        console.log('popular request failed')
        console.log(error)
    }
}
// /trending/{media_type}/{time_window}

const getTrending = async (req,res) =>{
    const {media_type, time_window} = req.params
    // Media type = all, movie, tv, person
    // Time_window = day, week
    try{
        str = `https://api.themoviedb.org/3/trending/${media_type}/${time_window}?api_key=${key}`
        const result =  await axios.get(str)
        res.status(200).json({
            status: 'success',
            results: result.data
        })
    }catch(error){
        console.log('Trending request failed')
        console.log(error)
    }
}

const getMovieById = async (req,res) => {
    const { id } = req.params
    try{
        str = `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
        const result =  await axios.get(str)
        res.status(200).json({
            status: 'success',
            results: result.data
        })
    }catch(error){
        console.log('Movie request failed')
        console.log(error)
        return res.status(404).json({
            status: 'failure',
            results: error
        })
    }
}

const getTVById = async (req,res) => {
    const { id } = req.params
    try{
        str = `https://api.themoviedb.org/3/tv/${id}?api_key=${key}&language=en-US`
        const result =  await axios.get(str)
        res.status(200).json({
            status: 'success',
            results: result.data
        })
    }catch(error){
        console.log('TV  request failed')
        console.log(error)
        return res.status(404).json({
            status: 'failure',
            results: error
        })
    }
}

const getResultsByQuery = async (req,res) => {
    const { query, page, media_type } = req.params
    try{
        str = `https://api.themoviedb.org/3/search/${media_type}?api_key=${key}&query=${query}&page=${page}&include_adult=false`
        const result =  await axios.get(str)
        res.status(200).json({
            status: 'success',
            results: result.data
        })
    }catch(error){
        console.log('Get Movie by query request failed')
        console.log(error)
        return res.status(404).json({
            status: 'failure',
            results: error
        })
    }
}

module.exports = {
    getPopularByPage,
    getTrending,
    getMovieById,
    getTVById,
    getResultsByQuery
}