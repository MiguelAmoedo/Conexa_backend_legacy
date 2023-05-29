const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

// Rota para o login do cliente
router.post('/cliente', loginController.loginCliente);

// Rota para o cadastro do funcionário
router.post('/cliente/cadastro', loginController.cadastrarCliente);

// Rota para o login do vendedor
router.post('/vendedor', loginController.loginVendedor);

// Rota para o cadastro do vendedor
router.post('/vendedor/cadastro', loginController.cadastrarVendedor);

// Rota para validar o token de autenticação
router.post('/validarToken', loginController.validarToken);

module.exports = router;
