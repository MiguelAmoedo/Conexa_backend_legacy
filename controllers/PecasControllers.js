
const Peca = require('../models/PecasModels');
const Vendedor = require('../models/VendedorModels');


const PecasVendidas = require('../models/pecasVendidasModels');

exports.getPecasVendidasByVendedorId = async (req, res) => {
  const vendedorId = req.params.vendedorId;

  try {
    const pecasVendidas = await PecasVendidas.find({ vendedorId });

    if (!pecasVendidas || pecasVendidas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma peça vendida encontrada para o vendedor especificado.' });
    }

    return res.status(200).json(pecasVendidas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocorreu um erro ao buscar as peças vendidas do vendedor.' });
  }
};


exports.getPecas = async (req, res) => {
  const { marca, modelo, ano } = req.query;

  try {
    // Consulte o banco de dados para buscar as peças com os critérios de filtro
    const pecas = await Peca.find({ marca, modelo, ano });

    res.json(pecas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as peças.' });
  }
};


exports.advancedSearch = async (req, res) => {
  const { marca, modelo, ano } = req.query;

  try {
    const filtro = {
      $or: [
        { ano: { $regex: ano, $options: 'i' } },
        { modelo: { $regex: modelo, $options: 'i' } },
        { marca: { $regex: marca, $options: 'i' } },
      ],
    };

    const pecas = await Peca.find(filtro);

    // Verifica se os três campos batem
    if (pecas.length > 0 && marca && modelo && ano) {
      res.json({
        message: 'Pesquisa feita com sucesso',
        result: pecas,
      });
    }
    // Verifica se dois dos três campos batem
    else if (pecas.length > 0 && ((marca && modelo) || (marca && ano) || (modelo && ano))) {
      res.json({
        message: 'Dois dos três campos batem',
        result: pecas,
      });
    }
    // Verifica se um dos três campos bate
    else if (pecas.length > 0 && (marca || modelo || ano)) {
      res.json({
        message: 'Um dos três campos bate',
        result: pecas,
      });
    }
    // Nenhum dos três campos bate
    else {
      res.json({
        message: 'Falha na pesquisa',
        result: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as peças.' });
  }
};


exports.getAllPecas = async (req, res) => {
  try {
    const pecas = await Peca.find();
    res.status(200).json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para obter uma peça por ID
exports.getPecaById = async (req, res) => {
  const { id } = req.params;
  try {
    const peca = await Peca.findById(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para criar uma nova peça
exports.createPeca = async (req, res) => {
  const { idVendedor, ...pecaData } = req.body;
  try {
    const peca = new Peca({ idVendedor, ...pecaData });
    const novaPeca = await peca.save();
    res.status(201).json(novaPeca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para atualizar uma peça existente
exports.updatePeca = async (req, res) => {
  const { id } = req.params;
  const { idVendedor, ...pecaData } = req.body;
  try {
    const peca = await Peca.findByIdAndUpdate(id, { idVendedor, ...pecaData }, { new: true });
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para excluir uma peça existente
exports.deletePeca = async (req, res) => {
  const { id } = req.params;
  try {
    const peca = await Peca.findByIdAndDelete(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json({ message: 'Peça excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



