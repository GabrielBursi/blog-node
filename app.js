import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    app.use(express.static(path.join(__dirname,"public")))

//!Rotas

    app.use('/admin', routerAdm)
    
//!

app.listen(3000)