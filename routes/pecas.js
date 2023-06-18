const express = require('express');
const router = express.Router();

// Importe os controladores necessários
const {
  getAllPecas,
  getPecaById,
  createPeca,
  updatePeca,
  deletePeca,
  relatoriosPecas,
  getEstoque,
  getPecas


} = require('../controllers/PecasControllers');

// Rota para obter todas as peças
router.get('/', getAllPecas);

router.get('/', getPecas);

// Rota para obter uma peça por ID
router.get('/:id', getPecaById);

// Rota para criar uma nova peça
router.post('/', createPeca);

// Rota para atualizar uma peça existente
router.put('/:id', updatePeca);

// Rota para excluir uma peça existente
router.delete('/:id', deletePeca);

// Rota para gerar relatórios de peças
router.get('/relatorios', relatoriosPecas);

router.get('/estoque', getEstoque);

module.exports = router;
