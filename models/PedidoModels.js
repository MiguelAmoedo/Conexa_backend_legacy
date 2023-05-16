const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Autoconnectxs', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const pedidoSchema = new Schema ({
    dataPedido: {
        type: Date,
        default: Date.now,
        required: true
    },
    statusPedido: {
        type: String,
        enum: ['pendente', 'em andamento', 'entregue'],
        default: 'pendente',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    carrinho: {
        type: Schema.Types.ObjectId,
        ref: 'Carrinho',
        required: true
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = { Pedido };
