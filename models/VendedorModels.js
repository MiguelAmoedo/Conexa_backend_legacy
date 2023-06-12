const mongoose = require('mongoose');
const yup = require('yup');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const vendedorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return yup.string().required().isValidSync(value);
      },
      message: 'O nome é obrigatório.',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return yup.string().email().required().isValidSync(value);
      },
      message: 'O email fornecido é inválido.',
    },
  },
  senha: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return yup.string().required().isValidSync(value);
      },
      message: 'A senha é obrigatória.',
    },
  },
  cnpj: {
    type: String,
    require: true
  },
  endereco: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return yup.string().required().isValidSync(value);
      },
      message: 'O endereço é obrigatório.',
    },
  },
  telefone: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => {
        return yup.string().required().isValidSync(value.toString());
      },
      message: 'O telefone é obrigatório.',
    },
  },
  dataCadastro: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['Ativo', 'Inativo'],
    default: 'Ativo',
    validate: {
      validator: (value) => {
        return yup.string().oneOf(['Ativo', 'Inativo']).required().isValidSync(value);
      },
      message: 'O status fornecido é inválido.',
    },
  },
  token: { type: String },
  numeroSeguranca: { type: String },
});

const Vendedor = mongoose.model('Vendedores', vendedorSchema);

module.exports = Vendedor;
