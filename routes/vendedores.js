const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/VendedorControllers');

// Criar uma nova peça
router.post('/pecas', vendedorController.addPeca);

// Atualizar uma peça existente
router.put('/pecas/:id', vendedorController.updatePeca);

// Excluir uma peça existente
router.delete('/pecas/:id', vendedorController.deletePeca);

// Listar os pedidos do vendedor
router.get('/pedidos', vendedorController.getPedidos);

// Gerenciar o status de entrega de um pedido
router.put('/pedidos/:id', vendedorController.gerenciarStatusEntrega);

// Obter relatórios e estatísticas do vendedor
router.get('/relatorios', vendedorController.getRelatorios);

module.exports = router;
