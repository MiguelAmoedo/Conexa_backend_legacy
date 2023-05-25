const Vendedor = require('../models/VendedorModels');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../auth/auth');
const Peca = require('../models/PecasModels');

exports.addPeca = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado
    const { nome, descricao, preco, quantidade } = req.body;

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const peca = new Peca({
      nome,
      descricao,
      preco,
      quantidade,
      vendedor: vendedorId,
    });

    const newPeca = await peca.save();
    res.status(201).json(newPeca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePeca = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado
    const pecaId = req.params.id;
    const { nome, descricao, preco, quantidade } = req.body;

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const peca = await Peca.findOneAndUpdate(
      { _id: pecaId, vendedor: vendedorId },
      { nome, descricao, preco, quantidade },
      { new: true }
    );

    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json(peca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePeca = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado
    const pecaId = req.params.id;

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const deletedPeca = await Peca.findOneAndDelete({ _id: pecaId, vendedor: vendedorId });

    if (!deletedPeca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json({ message: 'Peça excluída com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPedidos = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const pedidos = await Peca.find({ vendedor: vendedorId });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.gerenciarStatusEntrega = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado
    const pedidoId = req.params.id;
    const { statusEntrega } = req.body;

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const pedido = await Peca.findOneAndUpdate(
      { _id: pedidoId, vendedor: vendedorId },
      { statusEntrega },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRelatorios = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    // Aqui você pode implementar a lógica para gerar os relatórios e estatísticas desejadas
    // com base nas peças cadastradas pelo vendedor

    res.status(200).json({ message: 'Relatórios e estatísticas do vendedor' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
