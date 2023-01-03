import express from 'express'

import ModelCategoria from '../models/Categoria.js'

import isAdmin from '../helpers/isAdmin.js'

const router = express.Router()

router.get('/', isAdmin, (req, res) => { //* rota index
    res.render('admin/index')
})

router.get('/lista', isAdmin, (req, res) => { //*rota lista
    ModelCategoria.find().sort({date:'desc'}).lean().then(items => {
        res.render('admin/lista', {items})
    })
    .catch(() => req.flash('error_msg', 'Houve um erro, tente novamente.'))
})

router.get('/lista/add', isAdmin, (req, res) => { //* rota para form add lista
    res.render('admin/add')
})

router.post('/lista/nova', isAdmin, (req, res) => { //* rota para criar nova categoria

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

router.get('/lista/edit/:id', isAdmin,  (req, res) => { //* rota para editar 
    ModelCategoria.findById(req.params.id).lean()
        .then(item => res.render('admin/edit',{item}))
        .catch(() => {
            req.flash('error_msg', 'Essa categoria não existe!')
            res.redirect('/admin/lista')
        })
})

router.post('/lista/edit', isAdmin,  (req, res) => { //* rota para editar e mudar a categoria
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

router.post('/lista/delete', isAdmin,  (req, res) => { //* rota para delete
    ModelCategoria.findByIdAndDelete(req.body.id).then(() => res.redirect('/admin/lista'))
})

export default router