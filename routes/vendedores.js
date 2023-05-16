const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/VendedorControllers');

router.get('/', vendedorController.getVendedores);
router.post('/', vendedorController.createVendedor);
router.get('/:id', vendedorController.getVendedorById);
router.put('/:id', vendedorController.updateVendedor);
router.delete('/:id', vendedorController.deleteVendedor);

//todas as rotas ok!
module.exports = router;
