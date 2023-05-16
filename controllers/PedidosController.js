const Pedido = require('../models/PedidoModels');
const Carrinho = require('../models/CarrinhoModels');
const Peca = require('../models/PecasModels');

exports.createPedido = async (req, res) => {
  try {
    // Verifica se o carrinho existe
    const idCarrinho = req.body.idCarrinho;
    const carrinho = await Carrinho.findById(idCarrinho);
    if (!carrinho) {
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }

    // Cria um novo pedido
    const novoPedido = new Pedido({
      idCliente: req.body.idCliente,
      itens: carrinho.itens,
      total: carrinho.total
    });
    await novoPedido.save();

    // Limpa o carrinho
    carrinho.itens = [];
    carrinho.total = 0;
    await carrinho.save();

    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePedido = async (req, res) => {
  try {
    const id = req.params.id;

    // Verifica se o pedido existe
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Atualiza o pedido
    pedido.idCliente = req.body.idCliente || pedido.idCliente;
    pedido.itens = req.body.itens || pedido.itens;
    pedido.total = req.body.total || pedido.total;
    await pedido.save();

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePedido = async (req, res) => {
  try {
    const id = req.params.id;

    // Verifica se o pedido existe
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Remove o pedido
    await pedido.remove();

    res.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
