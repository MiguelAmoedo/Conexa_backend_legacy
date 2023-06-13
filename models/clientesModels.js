const mongoose = require('mongoose');
const yup = require('yup');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  nome: {
    type: String,
    required: true,
    validate: {
      validator: (value) => yup.string().required().isValidSync(value),
      message: 'O campo nome é obrigatório.'
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => yup.string().required().email().isValidSync(value),
      message: 'O campo email é obrigatório e deve ser um email válido.'
    },
  },
  senha: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => yup.string().required().length(11).matches(/^\d+$/).isValidSync(value),
      message: 'O campo CPF é obrigatório e deve conter apenas números com 11 dígitos.'
    }
  },
  endereco: {
    type: String,
    required: true,
    validate: {
      validator: (value) => yup.string().required().isValidSync(value),
      message: 'O campo endereço é obrigatório.'
    }
  },
  telefone: {
    type: String,
    required: true,
    validate: {
      validator: (value) => yup.string().required().matches(/^\d+$/).isValidSync(value),
      message: 'O campo telefone é obrigatório e deve conter apenas números.'
    }
  },
  dataCadastro: {
    type: Date,
    required: true,
    default: Date.now()
  },
  token: {
    type: String
  },
  numeroSeguranca: {
    type: String
  }
});

const ClienteModel = mongoose.model('Cliente', ClienteSchema);

module.exports = ClienteModel;
