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
    constructor(id, login, nome, senha, perf_id, setor_id){
        this.id = id;
        this.login = login;
        this.nome = nome;
        this.senha = senha;
        this.perf_id = perf_id;
        this.setor_id = setor_id;
    }   

    
    // --> Efetuar login
    static async login(usuario, senha, res){

        if(!usuario || !senha) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});
        
        await Sql.conectar(async (sql) => {
            // TODO - Form validation

            let resp = await sql.query("SELECT user_id, user_login, user_nome, user_senha FROM usuario WHERE user_login = ? ", [usuario]);
            let row = resp[0];

            if(!resp || !resp.length) return res.status(400).send({message : "Usuário ou senha inválidos ! :("})


            const validPassword = await bcrypt.compare(senha, row.user_senha)
            if (!validPassword) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});

            let u = new Usuario;
            u.id = row.user_id;
            u.login = row.user_login;
            u.nome = row.user_nome;

            const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

            return res.status(200).send({ token })

        })
    
    }

    // --> Informacao do usuario
    static async userInfo(id, res) {

        if(!id) return res.status(400).send({message: "Usuário não encontrado !"});

        await Sql.conectar(async (sql) => {

            let resp = await sql.query("SELECT u.user_id, u.user_login, u.user_nome, p.perf_nome FROM usuario u INNER JOIN perfil p ON u.perf_id = p.perf_id WHERE u.user_id = ?",[id]);
            let row = resp[0];

            if(!resp || !resp.length) return res.status(400).send({message : "Usuário não encontrado !"})

            let u = new Usuario;
            u.id = row.user_id;
            u.login = row.user_login;
            u.nome = row.user_nome;
            u.perf_id = row.perf_nome

            return res.status(200).send({ u })

        })

    }

    // --> Criar usuario
    static async createUser(res, login, nome, perfilId) {

        //TODO --> Form validation

        let message;

        if(!login || !nome || !perfilId) return res.status(400).send({message: "Todos os campos devem ser preenchidos !"});

        await Sql.conectar(async (sql) => {
            try{
                bcrypt.hash(process.env.SENHA_PADRAO, parseInt(process.env.SALT_ROUNDS), async function(err, hash){
                    if (err) throw err;
                    
                    await sql.query("INSERT INTO usuario (user_login, user_nome, user_senha, perf_id) VALUES (?,?,?,?) ", [login, nome, hash, perfilId])
                    
                });
            }
            catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
                            message = `O login ${login} já está em uso`;
                            return res.status(400).send({ message })
							
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							message = "Perfil não encontrado";                            
                            return res.status(400).send({ message })
						default:
							throw e;
					}
				} else {
					throw e;
				}
            }

            return res.status(201).send({ message: `Usuario criado com sucesso ! Senha padrao : ${process.env.SENHA_PADRAO}` })
        })


    }

    static async listUser(res){

        let usuarios;

        await Sql.conectar(async(sql) => {
            
            usuarios = await sql.query("SELECT u.user_id, u.user_login, u.user_nome, p.perf_nome FROM usuario u INNER JOIN perfil p ON u.perf_id = p.perf_id")
                
        });

        return res.status(200).send( usuarios || [] )


    }


}



