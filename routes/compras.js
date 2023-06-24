const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/compraControllers');



// Rota para adicionar um item ao carrinho de compras
router.post('/carrinho', CompraController.adicionarItemCarrinho);

// Rota para remover uma peça do carrinho
router.delete('/carrinho/:pecaId', CompraController.removerItemCarrinho);

// Rota para finalizar a compra
router.post('/finalizar/:clienteId', CompraController.finalizarCompra);

// Rota para GET a CARRINHO
router.post('/carrinhoget', CompraController.getCarrinhos);

// Rota para GET one carrinho
router.get('/carrinhoget/:clienteId', CompraController.getCarrinhoDoCliente);

// Rota para obter os detalhes de uma compra
router.get('/:compraId', CompraController.obterDetalhesCompra);

// Rota para cancelar uma compra em andamento
router.put('/cancelar/:compraId', CompraController.cancelarCompra);

// Rota para cancelar uma compra em andamento
router.get('/', CompraController.getAllCompras);

router.put('/gerenciar/:id' ,  CompraController.gerenciar)

router.delete('/ola/:carrinhoId', CompraController.ola);


module.exports = router;
