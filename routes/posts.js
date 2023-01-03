import express from 'express'

import ModelCategoria from '../models/Categoria.js'
import ModelPostagens from '../models/Postagens.js'

import isAdmin from '../helpers/isAdmin.js'

const router = express.Router()

router.get('/', isAdmin, (req, res) => {
    res.render('posts/index')
})

router.get('/lista', isAdmin, (req, res) => {
    ModelPostagens.find().lean().populate('categoria').sort({data: 'desc'})
        .then(postagens => {
            res.render('posts/lista', {postagens})
        })
})

router.get('/lista/add', isAdmin, (req, res) => {
    ModelCategoria.find().lean()
        .then(items => {
            res.render('posts/add', {items})
        })
})

router.get('/lista/edit/:id', isAdmin, (req, res) => {

    ModelPostagens.findById(req.params.id).lean().then(postagem => {
        ModelCategoria.find().lean().then(categorias => {
            res.render('posts/edit', {postagem, categorias})
        }).catch(()=> {
            req.flash('error_msg', 'Houve um erro ao listar categorias')
            res.redirect('/posts/lista')
        })
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
        res.redirect('/posts/lista')
    })
})

router.post('/edit', isAdmin, (req, res) => {
    ModelPostagens.findById(req.body.id).then(postagem => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria
        postagem.descricao = req.body.descricao

        postagem.save().then(() => {
            req.flash('success_msg', 'Editada com sucesso!')
            res.redirect('/posts/lista')
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao editar')
            res.redirect('/posts/lista')
        })
    })
})

router.post('/nova', isAdmin, (req, res) => {
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

router.get('/delete/:id', isAdmin, (req, res) => {
    ModelPostagens.findByIdAndDelete(req.params.id).lean().then(() => res.redirect('/posts/lista'))
})

export default router


