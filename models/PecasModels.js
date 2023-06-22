const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const pecaSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  nome: { type: String, required: true },
  tipoDePeca: {
    type: String,
    required: true,
    enum: [
      'Airbags',
      'Anéis de pistão',
      'Bancos',
      'Bielas',
      'Bloco do motor',
      'Bomba de água',
      'Bomba de combustível',
      'Bomba de óleo',
      'Bóia de nível de combustível',
      'Cabeçote',
      'Cabos de ignição',
      'Capô',
      'Carroceria',
      'Catalisador',
      'Cilindro escravo de embreagem',
      'Cilindro mestre de embreagem',
      'Cilindro mestre de freio',
      'Cilindros de roda',
      'Comando de válvulas',
      'Correia dentada',
      'Corrente de distribuição',
      'Disco de embreagem',
      'Discos de freio dianteiros',
      'Discos de freio traseiros',
      'Faróis',
      'Filtro de ar',
      'Filtro de combustível',
      'Filtro de óleo',
      'Grades',
      'Lanternas',
      'Mangueiras de radiador',
      'Molas',
      'Molas a ar',
      'Molas de suspensão',
      'Molas helicoidais',
      'Motor',
      'Para-choques',
      'Para-lamas',
      'Path',
      'Painel de instrumentos',
      'Pastilhas de freio',
      'Pistões',
      'Pinças de freio',
      'Platô de embreagem',
      'Portas',
      'Radiador',
      'Radiador de óleo',
      'Retrovisores',
      'Rodas',
      'Rolamento de embreagem',
      'Silenciador',
      'Sistema de ignição',
      'Sistema de injeção de combustível',
      'Tanque de combustível',
      'Teto',
      'Tubo de escape',
      'Tuchos',
      'Válvula termostática',
      'Válvulas',
      'Velas de ignição',
      'Ventoinha do radiador',
      'Vidros',
      'Volante'
    ],
    default:  'Motor',
    required: true,
  },
  marca: {
    type: String,
    required: true,
    enum: [
      'Chevrolet',
      'Volkswagen',
      'Fiat',
      'Ford',
      'Toyota',
      'Honda',
      'Renault',
      'Hyundai',
      'Nissan',
      'Jeep',
    ],
    default:  'Chevrolet'
  },
  modelo: { type: String, required: true },
  imagem: { type: String , require: true},
  ano: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  qtdEstoque: { type: Number, required: true, min: 0},
  status: {
    type: String,
    enum: ['Disponivel', 'Vendida', 'Manutenção'],
    required: true,
  },
  idVendedor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendedor',
    required: true,
  },
  partesVeiculo: {
    type: [String],
    enum: [
      'Motor e Componentes',
      'Embreagem',
      'Tanque de combustível',
      'Catalisador',
      'Rodas',
      'Molas',
      'Disco de freio',
      'Radiador',
      'Carroceria',
    ],
    required: true,
  },
});

const Peca = mongoose.model('Peca', pecaSchema);

module.exports = Peca;