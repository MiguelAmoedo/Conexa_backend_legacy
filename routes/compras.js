const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/compraControllers');
const clienteId = require('../models/clientesModels');


// Rota para adicionar um item ao carrinho de compras
router.post('/carrinho', CompraController.adicionarItemCarrinho);

// Rota para remover um item do carrinho de compras
router.delete('/carrinho/:itemId', CompraController.removerItemCarrinho);

// Rota para finalizar a compra
router.post('/finalizar/:clienteId', CompraController.finalizarCompra);

// Rota para GET a CARRINHO
router.post('/carrinhoget', CompraController.getCarrinhos);

// Rota para GET one carrinho
router.post('/carrinhoget/:clienteId', CompraController.getCarrinhoDoClienteLogado);

// Rota para obter os detalhes de uma compra
router.get('/:compraId', CompraController.obterDetalhesCompra);

// Rota para cancelar uma compra em andamento
router.put('/cancelar/:compraId', CompraController.cancelarCompra);

// Rota para cancelar uma compra em andamento
router.get('/', CompraController.getAllCompras);


module.exports = router;
