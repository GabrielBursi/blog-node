import mongoose from "mongoose";

const Schema = mongoose.Schema

const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

const ModelCategoria = mongoose.model('categorias', Categoria)

export default ModelCategoria;