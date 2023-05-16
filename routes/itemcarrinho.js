const express = require('express');
const router = express.Router();
const itemCarrinhoController = require('../controllers/ItemCarrinhoController')

// Rotas para ItemCarrinho
router.post('/', itemCarrinhoController.addItemCarrinho);
router.get('/:id', itemCarrinhoController.getItemCarrinho);
router.put('/id', itemCarrinhoController.updateItemCarrinho);

module.exports = router;
