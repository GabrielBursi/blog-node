import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import mongoose from "mongoose";


import routerAdm from "./routes/admin.js";

const app = express()

//! Config

    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './views');

//!Rotas

    app.use('/admin', routerAdm)
    
//!

app.listen(3000)