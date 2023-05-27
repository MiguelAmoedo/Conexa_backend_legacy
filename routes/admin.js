const express = require('express');
const router = express.Router();
const {
    criarAdmin,
  loginAdmin,
  validarTokenAdmin,
  createVendedor,
  updateVendedor,
  deleteVendedor,
  createPeca,
  updatePeca,
  deletePeca,
  getAllClientes,
  getClienteById,
  getAllVendedores,
  getVendedorById,
  getAllPecas,
  getPecaById,
  getAllCompras,
  getCompraById,
  cancelarCompra,
 
  // Outros controladores relacionados às instruções fornecidas
} = require('../controllers/adminController');

// Rota para criação de um novo admin
router.post('/cadastro', criarAdmin);

// Rota para login do admin
router.post('/login', loginAdmin);

// Middleware para validar o token do admin
router.use(validarTokenAdmin);

// Rota para criação de um novo vendedor
router.post('/vendedores', createVendedor);

// Rota para atualização de um vendedor existente
router.put('/vendedores/:id', updateVendedor);

// Rota para exclusão de um vendedor
router.delete('/vendedores/:id', deleteVendedor);

// Rota para criação de uma nova peça
router.post('/pecas', createPeca);

// Rota para atualização de uma peça existente
router.put('/pecas/:id', updatePeca);

// Rota para exclusão de uma peça
router.delete('/pecas/:id', deletePeca);

// Rota para obter todos os clientes
router.get('/clientes', getAllClientes);

// Rota para obter um cliente pelo ID
router.get('/clientes/:id', getClienteById);

// Rota para obter todos os vendedores
router.get('/vendedores', getAllVendedores);

// Rota para obter um vendedor pelo ID
router.get('/vendedores/:id', getVendedorById);

// Rota para obter todas as peças
router.get('/pecas', getAllPecas);

// Rota para obter uma peça pelo ID
router.get('/pecas/:id', getPecaById);

// Rota para obter todas as compras
router.get('/compras', getAllCompras);

// Rota para obter uma compra pelo ID
router.get('/compras/:id', getCompraById);

// Rota para cancelar uma compra
router.put('/compras/:id/cancelar', cancelarCompra);

module.exports = router;
