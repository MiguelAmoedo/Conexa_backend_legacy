const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/CarrinhoControllers');

router.post('/', carrinhoController.createCarrinho);
router.get('/:idCliente', carrinhoController.getCarrinho);

module.exports = router;

