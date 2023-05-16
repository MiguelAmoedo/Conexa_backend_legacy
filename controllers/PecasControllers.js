const Peca = require('../models/PecasModels');
const Vendedor = require('../models/VendedorModels.js');

// Listar todas as peças
exports.listarPecas = async (req, res) => {
  try {
    const pecas = await Peca.find();
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obter uma peça por ID
exports.obterPecaPorId = async (req, res) => {
  try {
    const peca = await Peca.findById(req.params.id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Criar uma nova peça
exports.criarPeca = async (req, res) => {
  try {
    // Verificar se o vendedor associado à peça existe
    const vendedor = await Vendedor.findById(req.body.idVendedor);
    if (!vendedor) {
      return res.status(400).json({ message: 'Vendedor associado à peça não encontrado' });
    }

    // Criar a nova peça e salvá-la no banco de dados
    const novaPeca = new Peca(req.body);
    await novaPeca.save();

    res.status(201).json(novaPeca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Atualizar uma peça existente
exports.atualizarPeca = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar se a peça existe
    const peca = await Peca.findById(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    // Verificar se o vendedor associado à peça existe
    const vendedor = await Vendedor.findById(req.body.idVendedor);
    if (!vendedor) {
      return res.status(400).json({ message: 'Vendedor associado à peça não encontrado' });
    }

    // Atualizar a peça e salvá-la no banco de dados
    const pecaAtualizada = await Peca.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(pecaAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Excluir uma peça existente
exports.excluirPeca = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar se a peça existe
    const peca = await Peca.findById(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    // Excluir a peça do banco de dados
    await Peca.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
