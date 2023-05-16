const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/PedidosController');

// Rota para criar um novo pedido
router.post('/', PedidosController.createPedido);

// Rota para buscar um pedido pelo id
router.get('/:id', PedidosController.getPedido);

// Rota para atualizar um pedido pelo id
router.put('/:id', PedidosController.updatePedido);

// Rota para deletar um pedido pelo id
router.delete('/:id', PedidosController.deletePedido);

module.exports = router;
