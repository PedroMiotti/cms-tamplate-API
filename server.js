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
    const Perfil = require('./routes/perfil/perfil');


// CONFIG
    app.use(express.json());
    app.use(cors());



// ROTAS
    app.use('/usuario', Usuario);
    app.use('/perfil', Perfil);



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server Ok!")
});
