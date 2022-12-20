import express from 'express'

const router = express.Router()

router.get('/',(req, res) => {
    res.send('pag /')
})

router.get('/teste',(req, res) => {
    res.render('home')
})

export default router