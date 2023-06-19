const mongoose = require('mongoose');

const PecasVendidasSchema = new mongoose.Schema({
  dataCompra: {
    type: Date,
    required: true,
  },
  idCliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  nomeCliente: {
    type: String,
    required: true,
  },
  telefoneCliente: {
    type: String,
    required: true,
  },
  pecaId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peca',
    required: true,
  }],
  nomePeca: [{
    type: String,
    required: true,
  }],
});

const PecasVendidas = mongoose.model('PecasVendidas', PecasVendidasSchema);

module.exports = PecasVendidas;
