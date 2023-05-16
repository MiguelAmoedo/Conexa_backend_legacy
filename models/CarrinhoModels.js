const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const carrinhoSchema = new Schema({
  idCliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
});

const CarrinhoModel = mongoose.model('Carrinho', carrinhoSchema);

module.exports = { CarrinhoModel };
