const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClientesControllers');
const { validarToken } = require('../auth/auth');

router.use(clienteController.validarToken);
// Rota para obter todos os clientes
router.get('/',  clienteController.getAllClientes);

// Rota para obter um cliente por ID
router.get('/:id',  clienteController.getClienteById);

// Rota para atualizar um cliente
router.put('/:id',  clienteController.updateCliente);

// Rota para excluir um cliente
router.delete('/:id',  clienteController.deleteCliente);

module.exports = router;
