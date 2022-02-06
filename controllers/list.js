const { response } = require('express');
const db = require('../db/index')
require('dotenv').config();
// Retrieve all lists owned by a user
const getListsByUsername = async (req,res) => {
    try{
        const { username } = req.params
        const list = await retrieveListsByUsername(username)
        console.log(list)
        if(!list){
            return res.status(200).send({
                username: username,
                list
            })
        }
        console.log("mylist", list)
        res.status(200).send({
            username: username,
            list
        })
    }catch(err){
        console.log(err)
    }
}

// Retrieve all lists owned by an authenticated user and whether the film id is in the watchlist
// Will retrieve all Lists owned by user, with additional columns list_id, film_id and film_type. Value will be null if show is not in watchlist
const retrieveListsWithFilmIdExistance = async (req,res) => {
    // return res.status(404).send(err)
    try{
        const userId = req.user.user_id
        const { filmId, filmType } = req.body
        console.log(filmType)
        const q = "SELECT * FROM lists LEFT JOIN lists_films ON lists.id = lists_films.list_id AND lists.user_id = $1 AND ( (lists_films.film_id = $2 AND lists_films.film_type = $3) OR lists_films.film_id IS NULL) WHERE lists.user_id = $1"
        const response = await db.query(q, [userId, filmId, filmType]);
        const list = response
        // if(!list) throw "No such list!"
        res.status(200).send(list)
    }catch(err){
        console.log(err)
        return res.status(404).send(err)
    }
}

// Retrieve a single list based on its ID
const getListById = async (req,res) => {
    try{
        const { id } = req.params
        const q = 'SELECT lists.*, users.username FROM lists LEFT JOIN users on lists.user_id = users.id WHERE lists.id = $1 LIMIT 1';
        const response = await db.query(q, [id]);
        const list = response.rows[0]
        if(!list) throw "No such list!"
        res.status(200).send(list)
    }catch(err){
        console.log(err)
        res.status(404).send({
            error: err
        })
    }
}

const createList = async (req,res) => {
    const userID = req.user.user_id
    const {inputTitle, inputDescription} = req.body
    console.log(req.body)
    try{
        const q = 'INSERT INTO lists(list_name, user_id, description) values($1,$2,$3) RETURNING *';
        const values = [inputTitle, userID, inputDescription];
        const response2 = await db.query(q, values);
        return res.status(200).send({
            status: "success",
            response: response2.rows
        })
    }catch(err){
        console.log("Create list failed, this is the error message: ", err)
        return null
    }
}

const deleteList = async (req,res) => {
    const userId = req.user.user_id
    const inputId = req.body.inputID
    try{
        const q = 'DELETE FROM lists WHERE id=$1 AND user_id = $2 RETURNING *';
        const values = [inputId, userId];
        const response = await db.query(q, values);
        return res.status(200).send({
            status: "success",
            response: response.rows
        })
    }catch(err){
        console.log("Delete list failed, this is the error message: ", err)
        return res.status(500).send(err)
    }
}

const getAuthenticatedUserLists =  async (req, res) =>{
    const list = await retrieveListsByUsername(req.user.username)
    if(!list){
        return res.status(200).send({
            username: req.user.username,
            list
        })
    }
    console.log("mylist", list)
    res.status(200).send({
        username: req.user.username,
        list
    })
}


const toggleShowFromWatchlist =  async (req, res) =>{
    const listID = req.body.listID
    const filmID = req.body.filmID
    const filmType = req.body.filmType
    let response
    let action
    try{
        // let q = 'SELECT * FROM lists_films WHERE list_id = $1 AND film_id=$2 AND film_type = $2 RETURNING *';
        let q = "SELECT 1 FROM lists_films WHERE list_id = $1 AND film_id=$2 AND film_type = $3 LIMIT 1";
        let values = [listID, filmID, filmType];
        let exists = await db.query(q, values);
        if (exists.rows.length > 0) {
            console.log('exists')
            q = 'DELETE FROM lists_films WHERE list_id = $1 AND film_id=$2 AND film_type = $3 RETURNING *';
            response = await db.query(q, values)
            action="delete"
        }else{
            console.log('not exists')
            q = 'INSERT INTO lists_films(list_id, film_id, film_type) values($1,$2,$3) RETURNING *';
            response = await db.query(q, values)
            action="add"
        }
        return res.status(200).send({
            status: "success",
            response: response.rows,
            action: action
        })
    }catch(err){
        console.log("Insert show to watchlist failed, this is the error message: ", err)
        return res.status(500).send({
            status: "fail",
            error: err
        })
    }
}

const getMediaFromWatchlist = async (req, res) => {
    // Get list_id, film_id and media type
    try{
        const {listID} = req.params
        let q = "SELECT * FROM lists_films WHERE list_id = $1"
        const response = await db.query(q, [listID])
        res.status(200).send({
            status:"success",
            response: response.rows
        })
    }catch(err){
        return res.status(500).send({
            status: "fail",
            error: err
        })
    }
}

module.exports = {
    createList,
    getListsByUsername,
    getAuthenticatedUserLists,
    deleteList,
    getListById,
    retrieveListsWithFilmIdExistance,
    toggleShowFromWatchlist,
    getMediaFromWatchlist
}

// Helper functions

const retrieveListsByUsername = async (username) => {
    // let q = 'INSERT INTO users(username,password,created_on) VALUES($1,$2,$3) RETURNING *';
    try{
        const q = 'SELECT lists.id, list_name, username FROM lists LEFT JOIN users ON user_id = users.id WHERE username = $1';
        const values = [username];
        const response = await db.query(q, values);
        return response.rows
    }catch(err){
        console.log("retrive list by username failed, this is the error message: ", err)
        return null
    }

}