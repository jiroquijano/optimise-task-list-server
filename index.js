const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
require('./db/mongoose');

app.use(express.json());
app.listen(PORT, ()=>{
    console.log(`app listening on port: ${PORT}`)
});

