const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const movimentacaoEstoqueSchema = new Schema({
  peca: {
    type: Schema.Types.ObjectId,
    ref: 'Peca',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
  },
  motivo: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

const MovimentacaoEstoque = mongoose.model('MovimentacaoEstoque', movimentacaoEstoqueSchema);

module.exports = MovimentacaoEstoque;
