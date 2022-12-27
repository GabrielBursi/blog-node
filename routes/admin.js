import express from 'express'
import { Model } from 'mongoose'

import ModelCategoria from '../models/Categoria.js'

const router = express.Router()

router.get('/',(req, res) => {
    res.render('admin/index')
})

router.get('/lista',(req, res) => {
    ModelCategoria.find().sort({date:'desc'}).lean().then(items => {
        res.render('admin/lista', {items})
    })
    .catch(() => req.flash('error_msg', 'Houve um erro, tente novamente.'))
})

router.get('/lista/add',(req, res) => {
    res.render('admin/add')
})

router.post('/lista/nova',(req, res) => {

    const erros = []

    if(!req.body.name || req.body.name == undefined || req.body.name === null){
        erros.push({err:'Nome inválido!'})
        res.render('admin/add', {erros: erros})
    }else if(!req.body.slug || req.body.slug === undefined || req.body.slug === null){
        erros.push({err:'Slug inválido!'})
        res.render('admin/add', {erros: erros})
    }else{
        
        const novaCategoria = {
            nome: req.body.name,
            slug: req.body.slug
        }
    
        new ModelCategoria(novaCategoria).save()
            .then(()=> {
                req.flash('success_msg', 'Cadastro realizado com sucesso!')
                res.redirect('/admin/lista')
            })
            .catch(() => req.flash('error_msg', 'Houve um erro, tente novamente.'))
    }

})

router.get('/lista/edit/:id', (req, res) => {
    ModelCategoria.findById(req.params.id).lean()
        .then(item => res.render('admin/edit',{item}))
        .catch(() => {
            req.flash('error_msg', 'Essa categoria não existe!')
            res.redirect('/admin/lista')
        })
})

router.post('/lista/edit', (req, res) => {
    ModelCategoria.findById(req.body.id).then(item => {
        item.nome = req.body.name
        item.slug = req.body.slug

        item.save().then(() => {
            req.flash('success_msg', 'Editada com sucesso!')
            res.redirect('/admin/lista')
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao editar')
            res.redirect('/admin/lista')
        })

    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao encontrar o ID')
        res.redirect('/admin/lista')
    })
})

router.post('/lista/delete', (req, res) => {
    ModelCategoria.findByIdAndDelete(req.body.id).then(() => res.redirect('/admin/lista'))
})

export default router