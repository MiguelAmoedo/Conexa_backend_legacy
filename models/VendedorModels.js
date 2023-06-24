const mongoose = require('mongoose');
const yup = require('yup');

mongoose.connect('mongodb+srv://autoconnect:1234567890@autoconnect.3y5jf2e.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const telefoneSchema = yup
  .string()
  .required('O telefone é obrigatório.')
  .matches(
    /^(55)(\d{2})(9\d{8})$/,
    'Telefone inválido. Insira um número válido de telefone com código do país, DDD, número celular e formato de operadora (oi, tim, claro ou vivo).'
  );

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
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return telefoneSchema.isValidSync(value);
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
