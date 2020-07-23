// IMPORTS

    // Express
    const express = require('express');
    const router = express.Router();
    // SQL
    const Sql = require('../../infra/sql');
    //Model
    const Usuario = require('../../models/usuario/usuario');


// Rotas
    
    router.get('/', (req, res) => {
        res.json('Hello from usuarios');
    })

router.post("/login", async (req,res) => {
    console.log(req.body);

    await Usuario.login(req.body.username, req.body.password, res)
    
})


module.exports = router;
