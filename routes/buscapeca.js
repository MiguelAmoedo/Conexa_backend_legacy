const express = require('express');
const router = express.Router();
const buscaPeca = require('../controllers/BuscaPecasController');

router.get('/', buscaPeca.buscaPeca);

module.exports = router;
