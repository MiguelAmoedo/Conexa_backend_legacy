const mongoose = require('mongoose');
const yup = require('yup');

mongoose.connect('mongodb+srv://autoconnect:1234567890@autoconnect.3y5jf2e.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

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
  },

  carrinho: {
    type: Schema.Types.ObjectId,
    ref: 'Compra',
  }
});

const ClienteModel = mongoose.model('Cliente', ClienteSchema);

module.exports = ClienteModel;
