const express = require('express');
const router = express.Router();
const pecasController = require('../controllers/PecasControllers')

// Listar todas as peças
router.get('/', pecasController.listarPecas);

// Obter uma peça por ID
router.get('/:id', pecasController.obterPecaPorId);

// Criar uma nova peça
router.post('/', pecasController.criarPeca);

// Atualizar uma peça existente
router.put('/:id', pecasController.atualizarPeca);

// Excluir uma peça existente
router.delete('/:id', pecasController.excluirPeca);

// todas as rotas ok !
module.exports = router;
