import express from 'express'

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

export default router