import express from 'express'

import ModelCategoria from '../models/Categoria.js'
import ModelPostagens from '../models/Postagens.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('posts/index')
})

router.get('/lista', (req, res) => {
    ModelPostagens.find().lean().populate('categoria').sort({data: 'desc'})
        .then(postagens => {
            res.render('posts/lista', {postagens})
        })
})

router.get('/lista/add', (req, res) => {
    ModelCategoria.find().lean()
        .then(items => {
            res.render('posts/add', {items})
        })
})

router.post('/nova', (req, res) => {
    const erros = []

    if(req.body.categoria == '0'){
        erros.push({erro: 'Categoria invalida, registre uma categoria'})
    }

    if(erros.length > 0){
        res.render('posts/add', {erros})
    }else{
        const novaPost = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
        new ModelPostagens(novaPost).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/posts/lista')
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao criar')
            res.redirect('/posts/lista')
        })
    }
})

export default router


