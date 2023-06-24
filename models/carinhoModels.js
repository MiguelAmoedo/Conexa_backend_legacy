const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const carrinhoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  itens: [{
    peca: {
      type: Schema.Types.ObjectId,
      ref: 'Peca',
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
    },
    precoUnitario: {
      type: Number,
      required: true,
    },
    precoTotal: {
      type: Number,
      required: true,
    },
  }],
});

const Carrinho = mongoose.model('carrinho', carrinhoSchema);

module.exports = Carrinho;
