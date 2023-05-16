const express = require('express');
const router = express.Router();
const buscaPecasController = require('../controllers/BuscaPecasController');

router.get('/', buscaPecasController.buscarPecas);

module.exports = router;
