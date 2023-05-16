const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });


const vendedorSchema = new mongoose.Schema({

 
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  cnpj: { type: String },
  endereco: { type: String, required: true },
  telefone: { type: String, required: true },
  dataCadastro: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ['Ativo', 'Inativo'], default: 'Ativo' }
});

const Vendedor = mongoose.model('Vendedores', vendedorSchema);

module.exports = Vendedor;
