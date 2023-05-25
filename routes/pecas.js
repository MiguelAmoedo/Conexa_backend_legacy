const express = require('express');
const router = express.Router();
const pecasController = require('../controllers/PecasControllers');

// Listar todas as peças
router.get('/', pecasController.getEstoque);

// Criar uma nova peça
router.post('/', pecasController.addPeca);

// Atualizar uma peça existente
router.put('/:id', pecasController.updatePeca);

// Excluir uma peça existente
router.delete('/:id', pecasController.deletePeca);

module.exports = router;
