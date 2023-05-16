const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });


const Schema = mongoose.Schema;

const buscaSchema = new Schema({
  nome: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  qtdEstoque: { type: Number, required: true },
  status: { type: String, required: true },
  idVendedor: { type: Schema.Types.ObjectId, ref: 'Vendedor', required: true },
  partesVeiculo: {
    type: [String],
    enum: [
      'Motor e Componentes',
      'Embreagem',
      'Tanque de combustível',
      'Catalisador',
      'Molas',
      'Disco de freio',
      'Radiador',
      'carroceria'
    ],
    required: true
  }
});

const BuscaPeca = mongoose.model('BuscaPeca', buscaSchema);

module.exports = BuscaPeca;
