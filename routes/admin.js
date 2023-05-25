const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../auth/admin');

// Rotas do administrador
router.post('/admin/login', adminController.loginAdmin);
router.post('/admin/validar-token', adminController.validarTokenAdmin);

router.get('/admin/clientes', adminAuth, adminController.getAllClientes);
router.get('/admin/clientes/:id', adminAuth, adminController.getClienteById);
router.post('/admin/clientes', adminAuth, adminController.addCliente);
router.put('/admin/clientes/:id', adminAuth, adminController.updateCliente);
router.delete('/admin/clientes/:id', adminAuth, adminController.deleteCliente);

router.get('/admin/vendedores', adminAuth, adminController.getVendedores);
router.post('/admin/vendedores', adminAuth, adminController.addVendedor);
router.put('/admin/vendedores/:id', adminAuth, adminController.updateVendedor);
router.delete('/admin/vendedores/:id', adminAuth, adminController.deleteVendedor);

router.post('/admin/pecas', adminAuth, adminController.addPeca);
router.put('/admin/pecas/:id', adminAuth, adminController.updatePeca);
router.delete('/admin/pecas/:id', adminAuth, adminController.deletePeca);

router.get('/admin/pedidos', adminAuth, adminController.getPedidos);
router.get('/admin/estoque', adminAuth, adminController.getEstoque);

module.exports = router;
