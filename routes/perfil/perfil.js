"use strict";
// IMPORTS

    // Express
    const express = require('express');
    const router = express.Router();

    //Model
    const Perfil = require('../../models/perfil/perfil');


// ROTAS

    // --> Efetuar login
    router.get("/lista" , async (req,res) => {

        await Perfil.lista(res)

    })


module.exports = router;
