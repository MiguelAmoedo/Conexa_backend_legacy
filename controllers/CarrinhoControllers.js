const Carrinho = require('../models/CarrinhoModels')

exports.createCarrinho = async (req, res) => {
  try {
    const { idCliente } = req.body;
    const carrinho = await Carrinho.CarrinhoModel.create({ idCliente });
    res.status(201).json(carrinho);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCarrinho = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const carrinho = await Carrinho.CarrinhoModel.findOne({ idCliente });
    if (!carrinho) {
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }
    res.status(200).json(carrinho);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
