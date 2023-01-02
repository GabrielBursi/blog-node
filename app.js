import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from 'express-session';
import flash from 'connect-flash';

import routerAdm from "./routes/admin.js";
import routerPosts from "./routes/posts.js";
import routerUser from './routes/user.js';

import ModelPostagens from './models/Postagens.js';
import ModelCategoria from './models/Categoria.js';

import passport from 'passport';
import passportFun from './config/auth.js';'./config/auth.js'
passportFun(passport)

const app = express()

//! Config
    //!Sessão
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'curso node',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true }
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash());
    //!Middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })
    //*
    
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './views');

    app.use(express.static(path.join(__dirname,"public")))

    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect('mongodb://localhost:27017/blognode');
    } catch (error) {
        console.log(error);
    }

//!Rotas
    //!Rotas Home
    app.get('/',(req, res) => {
        ModelPostagens.find().lean().populate("categoria").sort({data: 'desc'})
            .then(postagens => res.render('home', {postagens}))
            .catch(() => res.redirect('/404'))
    })

    app.get('/postagens/:slug', (req, res) => {
        ModelPostagens.findOne({slug:req.params.slug}).lean().then(postagem => {
            if(postagem) {
                res.render('postagem/index',{postagem})
            }
            else{
                res.redirect('/')
            }
        })
    })

    app.get('/categorias', (req, res) => {
        ModelCategoria.find().lean().then(categoria => {
            res.render('categorias/index', {categoria})
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        ModelCategoria.findOne({slug:req.params.slug}).lean().then(categoria => {
            if(categoria) {
                ModelPostagens.find({categoria: categoria._id}).lean().then(postagem => {
                    res.render('categorias/postagens',{postagem, categoria})
                })
            }
            else{
                res.redirect('/')
            }
        })
    })

    app.get('404', (req, res) => res.send('404'))

    //!Rotas Das paginas
    app.use('/admin', routerAdm)
    app.use('/posts', routerPosts)
    app.use('/registro', routerUser)
    
//!

app.listen(3000)