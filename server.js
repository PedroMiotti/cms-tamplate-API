"use strict";
// IMPORTS
    // Express
    const express = require('express');
    const app = express();
    //Dotenv
    require('dotenv').config();
    //Cors
    const cors = require('cors');
    //Rotas
    const Usuario = require('./routes/usuario/usuario');



// CONFIG
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json("Hello")
})


// Rotas
app.use('/usuario', Usuario);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server Ok!")
});
