const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/compraControllers');

// Rota para adicionar um item ao carrinho de compras
router.post('/carrinho', CompraController.adicionarItemCarrinho);

// Rota para remover um item do carrinho de compras
router.delete('/carrinho', CompraController.removerItemCarrinho);

// Rota para finalizar a compra
router.post('/finalizar/:compraId', CompraController.finalizarCompra);

// Rota para obter os detalhes de uma compra
router.get('/:compraId', CompraController.obterDetalhesCompra);

// Rota para cancelar uma compra em andamento
router.put('/cancelar/:compraId', CompraController.cancelarCompra);

// Rota para obter todas as compras
router.get('/', CompraController.getAllCompras);

// Rota de pesquisa de peças
//router.get('/pecas/pesquisar', pesquisarPecas)

module.exports = router;
