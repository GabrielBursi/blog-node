function isAdmin(req,res, next){
        if(req.isAuthenticated() && req.user.isAdmin == 1)  return next()
        req.flash('error_msg','Voce precisar ser um Admin!')
        res.redirect('/')
    }
export default isAdmin