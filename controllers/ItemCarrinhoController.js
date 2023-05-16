const ItemCarrinho = require('../models/ItemcarrinhoModels');
const Carrinho = require('../models/CarrinhoModels');
const Peca = require('../models//PecasModels');

exports.addItemCarrinho = async (req, res) => {
  try {
    // Verifica se o carrinho existe
    const idCarrinho = req.body.idCarrinho;
    const carrinho = await Carrinho.findById(idCarrinho);
    if (!carrinho) {
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }

    // Verifica se a peça existe e possui estoque suficiente
    const idPeca = req.body.idPeca;
    const peca = await Peca.findById(idPeca);
    if (!peca) {
      return res.status(404).json({ message: "Peça não encontrada" });
    }
    if (peca.qtdEstoque < req.body.quantidade) {
      return res.status(400).json({ message: "Estoque insuficiente" });
    }

    // Cria um novo item do carrinho
    const newItemCarrinho = new ItemCarrinho(req.body);
    await newItemCarrinho.save();

    // Atualiza o total do carrinho
    carrinho.total += newItemCarrinho.subtotal;
    await carrinho.save();

    // Decrementa a quantidade do item no estoque da peça correspondente
    await Peca.findByIdAndUpdate(idPeca, { $inc: { qtdEstoque: -req.body.quantidade } });

    res.status(201).json(newItemCarrinho);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getItemCarrinho = async (req, res) => {
  try {
    const itemCarrinho = await ItemCarrinho.findById(req.params.id);
    if (!itemCarrinho) {
      return res.status(404).json({ message: "Item do carrinho não encontrado" });
    }
    res.json(itemCarrinho);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItemCarrinho = async (req, res) => {
  try {
    const id = req.params.id;

    // Verifica se o item do carrinho existe
    const itemCarrinho = await ItemCarrinho.findById(id);
    if (!itemCarrinho) {
      return res.status(404).json({ message: "Item do carrinho não encontrado" });
    }

    // Verifica se a peça existe e possui estoque suficiente
    const idPeca = req.body.idPeca || itemCarrinho.idPeca;
    const peca = await Peca.findById(idPeca);
    if (!peca) {
      return res.status(404).json({ message: "Peça não encontrada" });
    }
    const novaQuantidade = req.body.quantidade || itemCarrinho.quantidade;
    if (peca.qtdEstoque + itemCarrinho.quantidade < novaQuantidade) {
      return res.status(400).json({ message: "Estoque insuficiente" });
    }
  
// Atualiza o item do carrinho
itemCarrinho.idPeca = idPeca;
itemCarrinho.quantidade = novaQuantidade;
await itemCarrinho.save();

// Atualiza a quantidade no estoque da peça correspondente
const qtdEstoqueAntiga = itemCarrinho.quantidade;
const qtdEstoqueNova = novaQuantidade;
const diferencaEstoque = qtdEstoqueAntiga - qtdEstoqueNova;
await Peca.findByIdAndUpdate(idPeca, { $inc: { qtdEstoque: diferencaEstoque } });

res.json(itemCarrinho);
} catch (error) {
res.status(400).json({ message: error.message });
}
};  