import express from 'express'
import mongoose from 'mongoose'

import ModelCategoria from '../models/Categoria.js'

const router = express.Router()

router.get('/',(req, res) => {
    res.render('admin/index')
})

router.get('/lista',(req, res) => {
    res.render('admin/lista')
})
router.get('/lista/add',(req, res) => {
    res.render('admin/add')
})

router.post('/lista/nova',(req, res) => {
    const novaCategoria = {
        nome: req.body.name,
        slug: req.body.slug
    }

    new ModelCategoria(novaCategoria).save()
        .then(()=> console.log("Categoria Salva!"))
        .catch(err => console.log(err))
})

export default router