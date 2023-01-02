import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import ModelUsuario from '../models/Usuario.js'

function passportFun (passport){
        passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'senha'},(email, senha, done) => {
                ModelUsuario.findOne({ email: email }).then(usuario => {
                    if (!usuario)  return done(null, false); 

                    bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                        if(batem){
                            return done(null, usuario)
                        } else{
                            return done(null, false, {message: 'Senha incorreta'})
                        }
                    })

                })
            }
        ));

        passport.serializeUser((usuario,done) => {
            done(null,usuario.id)
        })
    
        passport.deserializeUser((id, done) => {
            ModelUsuario.findById(id, (erro, usuario) => {
                done(erro, usuario)
            })
        })
    }

export default passportFun