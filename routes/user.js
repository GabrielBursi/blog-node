import express from 'express';



const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/registro')
})

router.post('/registro', (req, res) => {
    const errors = []
    const senha = req.body.senha

    if(senha.length < 6){
        errors.push({erro: 'Senha pequena, mínimo de caracteres: 6'})
    }

    if(senha !== req.body.senha2){
        errors.push({erro: 'Senhas diferentes'})
    }

    if(errors.length > 0){
        res.render('users/registro', {errors})
    }else{

    }
})

export default router;