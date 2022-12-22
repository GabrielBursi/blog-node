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
    app.get('/',(req, res) => {
        res.render('home')
    })

    app.use('/admin', routerAdm)
    
//!

app.listen(3000)