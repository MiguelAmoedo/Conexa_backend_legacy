const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/admin', adminController.criarAdmin);
router.post('/login', adminController.loginAdmin);
router.post('admin/authenticate', adminController.autenticarAdmin);
router.use(adminController.validarToken);
router.get('/clientes', adminController.getAllClientes);
router.get('/clientes/:id', adminController.getClienteById);
router.get('/vendedores', adminController.getAllVendedores);
router.get('/vendedores/:id', adminController.getVendedorById);
router.get('/pecas', adminController.getAllPecas);
router.get('/pecas/:id', adminController.getPecaById);
router.get('/compras', adminController.getAllCompras);
router.get('/compras/:id', adminController.getCompraById);
router.patch('/compras/:id/cancelar', adminController.cancelarCompra);

module.exports = router;
