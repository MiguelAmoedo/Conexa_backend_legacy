const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClientesControllers');

//rota cliente
router.get('/', clienteController.getClientes);
router.get('/cpf/:cpf', clienteController.getClienteByCPF);
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

//todas as rotas ok!!!!
module.exports = router;
