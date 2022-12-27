import express from 'express'

import ModelCategoria from '../models/Categoria.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('posts/index')
})

router.get('/add', (req, res) => {
    ModelCategoria.find().lean()
        .then(items => {
            res.render('posts/add', {items})
        })
})


export default router