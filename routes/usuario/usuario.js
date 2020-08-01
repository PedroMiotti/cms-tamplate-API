"use strict";
// IMPORTS

    // Express
    const express = require('express');
    const router = express.Router();
    // SQL
    const Sql = require('../../infra/sql');
    //JWT
    const jwt = require('jsonwebtoken');

    //Model
    const Usuario = require('../../models/usuario/usuario');


// MIDDLEWARE
const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if(authHeader == null) return res.status(401).send({message: "Não autorizado"}) // If the user dont send the token
    
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
        if(err) return res.status(403).send({message: "Não autorizado"});

        next();
    })
    
}

// ROTAS

    // --> Efetuar login
    router.post("/login" , async (req,res) => {

        await Usuario.login(req.body.username, req.body.password, res)
        
        
    })

    // --> Informacoes do usuario
    router.post("/info", authToken , async (req,res) => {

        await Usuario.userInfo(req.body.id, res)
        
    });

    // --> Criar usuario
    router.post("/criar", authToken, async (req, res) => {
        console.log(req.body)


        await Usuario.createUser(res, req.body.login, req.body.nome, req.body.perfil)

    })




module.exports = router;
