const db = require('../db/index')
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const jwt = require('jsonwebtoken');


//Create user during registration
const createUser = async (req,res)=>{
    try{
        let {username, password} = req.body
        // Check if requests contains relevant info
        if (!(username && password )) {
            return res.status(400).send("All input is required");
        }
        // Check if user already exists
        let q1 = "SELECT DISTINCT username FROM users WHERE username = $1;"
        const user = await db.query(q1, [username]);
        if(user.rows[0]){
            return res.status(409).send("User Already Exist. Please Login");
        }
        // Hash and store password
        password = await bcrypt.hash(password, saltRounds);
        const t = new Date(Date.now()).toISOString();
        let q = 'INSERT INTO users(username,password,created_on) VALUES($1,$2,$3) RETURNING *';
        let values = [username, password, t];
        const results = await db.query(q, values);
        res.status(200).send({
            status: "success",
            result: results
        })
    }catch(err){
        console.log(err);
    }
}

const loginUser =  async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).send("All input is required");
        }
    // Validate if user exists in database
        let q = "SELECT * FROM users WHERE username = $1 LIMIT 1;"
        let user = await db.query(q, [username]);
        
        if (user?.rows[0] && (await bcrypt.compare(password, user.rows[0].password))) {
            // Create token
            user = user.rows[0]
            // console.log(user)

            const token = jwt.sign(
                { user_id: user.id, username },
                process.env.JWT_SECRET_KEY,
                {expiresIn: "2h",}
            );
            // save user token
            user.token = token;
            // user
            res.status(200).json(user);
        }else{
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
};

const getUserInfo = () => {
    console.log(user)
}

const getAuthenticatedUserInfo = (req, res) => {
    console.log("getAuthenticatedUserInfo", req.user)
    res.status(200).send(req.user)
}

module.exports = {
    createUser,
    loginUser,
    getUserInfo,
    getAuthenticatedUserInfo
}