"use strict"
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
    constructor(id, login, nome, senha, perf_id){
        this.id = id;
        this.login = login;
        this.nome = nome;
        this.senha = senha;
        this.perf_id = perf_id;
    }   

    
    // --> Efetuar login
    static async login(usuario, senha, res){

        if(!usuario || !senha) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});
        
        await Sql.conectar(async (sql) => {
            // TODO - Form validation

            let resp = await sql.query("SELECT user_id, user_login, user_nome, user_senha, perf_id FROM usuario WHERE user_login = ? ", [usuario]);
            let row = resp[0];

            if(!resp || !resp.length) return res.status(400).send({message : "Usuário ou senha inválidos ! :("})


            const validPassword = await bcrypt.compare(senha, row.user_senha)
            if (!validPassword) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});

            let u = new Usuario;
            u.id = row.user_id;
            u.login = row.user_login;
            u.nome = row.user_nome;
            u.perf_id = row.perf_id;

            const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

            return res.status(200).send({ token })

        })
    
    }

    // --> Informacao do usuario
    static async userInfo(id, res) {

        if(!id) return res.status(400).send({message: "Usuário não encontrado !"});

        await Sql.conectar(async (sql) => {

            let resp = await sql.query("SELECT user_id, user_login, user_nome, perf_id FROM usuario WHERE user_id = ?",[id]);
            let row = resp[0];

            if(!resp || !resp.length) return res.status(400).send({message : "Usuário não encontrado !"})

            let u = new Usuario;
            u.id = row.user_id;
            u.login = row.user_login;
            u.nome = row.user_nome;
            u.perf_id = row.perf_id

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

            return res.status(201).send({ message: `Usuário criado com sucesso ! Senha padrão : ${process.env.SENHA_PADRAO}` })
        })


    }

    // --> Listar todos os usuarios
    static async listUser(res){

        let usuarios;

        await Sql.conectar(async(sql) => {
            
            usuarios = await sql.query("SELECT u.user_id, u.user_login, u.user_nome, p.perf_nome FROM usuario u INNER JOIN perfil p ON u.perf_id = p.perf_id")
                
        });

        return res.status(200).send( usuarios || [] )


    }

    // --> Editar usuario
    static async editUser(res, id, nome, perfil){

        // TODO --> form validation

        if(!id) return res.status(400).send({message: "Usuário não encontrado !"});

        if (id === 1 || id === '1') return res.status(403).send({message: "Não é possivel editar o administrador princípal"});

        await Sql.conectar(async(sql) => {

            await sql.query("UPDATE usuario SET user_nome = ?, perf_id = ? WHERE user_id = ?", [nome, perfil, id])
            
            if(sql.linhasAfetadas === 0) return res.status(400).send({message : "Usuário não encontrado !"})

            return res.status(200).send({ message: "Usuário alterado com successo !"})
        })

    }

    // --> Deletar usuario
    static async deleteUser(res, id){

        if(!id) return res.status(400).send({message: "Usuário não encontrado !"});

        if(id === 1) return res.status(403).send({message: "Não é possivel excuir o administrador princípal"});

        await Sql.conectar(async(sql) => {
            await sql.query("DELETE FROM usuario WHERE user_id = ? ", [id]);

            if(sql.linhasAfetadas === 0) return res.status(400).send({message : "Usuário não encontrado !"})

            return res.status(200).send({ message: "Usuário excluido com successo !"})
        })

    }


    static async editProfile(res, id, nome, senhaAtual, novaSenha){
        // TODO --> Form validation

        await Sql.conectar(async(sql) => {
            if(senhaAtual){

                //Checking password
                let senhaBD = await sql.scalar("SELECT user_senha FROM usuario WHERE user_id = ?", [id]);
                const validPassword = await bcrypt.compare(senhaAtual, senhaBD)

                if (!validPassword) return res.status(400).send({ message : "Senha atual invalida ! " });
                if(senhaAtual === novaSenha) return res.status(400).send({ message : "Nova senha não pode ser igual a senha atual ! " });
                
                //Hash && Store new Password
                bcrypt.hash(novaSenha, parseInt(process.env.SALT_ROUNDS), async function(err, hash){
                    if (err) throw err;
                    
                    await sql.query("UPDATE usuario SET user_nome = ?, user_senha = ? WHERE user_id = ?",[nome, hash, id]);
                });

                this.nome = nome;

                // const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

                return res.status(201).send({  message: "Perfil alterado com successo !" });
            }
            else{
                await sql.query("UPDATE usuario SET user_nome = ? WHERE user_id = ?",[nome, id]);

                this.nome = nome;

                // const token = jwt.sign({ Usuario }, process.env.JWT_SECRET, { expiresIn: 31536000 })
                
                return res.status(201).send({ message: "Perfil alterado com successo !" });
            }

        })


    }


}



