const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const compraSchema = new Schema({
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
  }],
  status: {
    type: String,
    enum: ['Em andamento', 'Concluída', 'Cancelada'],
    default: 'Em andamento',
  },
  dataCompra: {
    type: Date,
    default: Date.now(),
  },
});

const Compra = mongoose.model('compras', compraSchema);

module.exports = Compra;
