const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });


const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    
  },

  cpf: {
    type: String,
    required: true,
    unique: true
  },
  endereco: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  dataCadastro: {
    type: Date,
    required: true,
    default: Date.now()
  }
  
  
  
});

const ClienteModel = mongoose.model('Cliente', ClienteSchema);

module.exports = ClienteModel;
