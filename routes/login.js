const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

// Rota para o login do cliente
router.post('/cliente', loginController.loginCliente);

// Rota para o login do funcionário
router.post('/vendedor', loginController.loginFuncionario);

// Rota para validar o token de autenticação
router.post('/validarToken', loginController.validarToken);

module.exports = router;
