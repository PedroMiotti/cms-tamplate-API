"use strict"

// IMPORTS
    // Express
    const express = require('express');
    //Dotenv
    require('dotenv').config();

    // Sql 
    const Sql = require('../../infra/sql');


module.exports = class Perfil {
    constructor(id, nome){
        this.id = id;
        this.nome = nome;
    }   

    static async lista(res){

        let perfil_lista = [];
        

        await Sql.conectar(async (sql) => {
            perfil_lista = await sql.query("SELECT perf_id, perf_nome FROM perfil ORDER BY perf_nome ASC ");
            

            if(!perfil_lista || !perfil_lista.length) return res.status(400).send({message : "Não existe nenhum perfil cadastrado ! :("})

            return res.status(200).send( perfil_lista || [] )

        })
    }

}
