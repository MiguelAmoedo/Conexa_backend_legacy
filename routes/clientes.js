const express = require('express');
const router = express.Router();
const {
 
  loginCliente,
  updateCliente,
  deleteCliente,
} = require('../controllers/ClientesControllers');


// Rota para fazer login de um cliente
router.post('/login', loginCliente);

// Rota para atualizar os dados de um cliente
router.put('/:id', updateCliente);

// Rota para excluir um cliente
router.delete('/:id', deleteCliente);

module.exports = router;
