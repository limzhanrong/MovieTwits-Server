require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const TMDB_Routes = require('./routes/tmdb')
const User_Routes = require('./routes/user')
const List_Routes = require('./routes/list')



const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.use('/api/tmdb', TMDB_Routes)
app.use('/api/user', User_Routes)
app.use('/api/list', List_Routes)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


