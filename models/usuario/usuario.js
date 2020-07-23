// IMPORTS
    // Express
    const express = require('express');
    //BcryptJs
    const bcrypt = require('bcryptjs');
    //JWT
    const jwt = require('jsonwebtoken');
    //Dotenv
    require('dotenv').config();

    // Sql 
    const Sql = require('../../infra/sql');


module.exports = class Usuario {
    constructor(id, usuario, nome, senha, perf_id, setor_id){
        this.id = id;
        this.usuario = usuario;
        this.nome = nome;
        this.senha = senha;
        this.perf_id = perf_id;
        this.setor_id = setor_id;
    }   

    

    static async login(usuario, senha, res){

        if(!usuario || !senha) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});
        
        await Sql.conectar(async (sql) => {
            let rows = await sql.query("SELECT user_id, user_login, user_nome, user_senha, user_token FROM usuario WHERE user_login = ? ", [usuario]);
            let row = rows[0];

            if(!rows || !rows.length) return res.status(400).send({message : "Usuário ou senha inválidos ! :("})

            const validPassword = await bcrypt.compare(senha, row.user_senha)
            if (!validPassword) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});

            let u = new Usuario;
            u.id = row.user_id;
            u.usuario = row.user_login;
            u.nome = row.user_nome;
            u.perf_id = row.perf_id;
            u.setor_id = row.setor_id;

            const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })
            console.log(token)

            return res.status(200).send({ token })

        })
    
    }


}



