import express from 'express';
import bcrypt from 'bcrypt'
import passport from 'passport';

import ModelUsuario from '../models/Usuario.js';

const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/registro')
})

router.post('/registro', (req, res) => {
    const errors = []
    const senha = req.body.senha

    if(senha.length < 6){
        errors.push({erro: 'Senha pequena, mínimo de caracteres: 6'})
    }

    if(senha !== req.body.senha2){
        errors.push({erro: 'Senhas diferentes'})
    }

    if(errors.length > 0){
        res.render('users/registro', {errors})
    }else{
        ModelUsuario.findOne({email: req.body.email}).then(usuario => {
            if(usuario){
                req.flash('error_msg', 'Esse email já existe!')
                res.redirect('/registro')
            }else{
                const novoUsuario = new ModelUsuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(err){
                            req.flash('error_msg', 'Houve um erro ao salvar o usuario')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Cadastro realizado com sucesso')
                            res.redirect('/')
                        })
                    });
                });
            }
        })
    }
})

router.get('/login',(req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/registro/login',
        failureFlash: true
    })(req, res, next)
})

export default router;