const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const itemCarrinhoSchema = new mongoose.Schema({
  idCarrinho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrinho',
    required: true
  },
  idPeca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peca',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports = mongoose.model('ItemCarrinho', itemCarrinhoSchema);
