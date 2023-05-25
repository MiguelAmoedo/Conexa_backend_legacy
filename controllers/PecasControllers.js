
const Peca = require('../models/PecasModels');
const Vendedor = require('../models/VendedorModels');

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


exports.getEstoque = async (req, res) => {
  try {
    const vendedorId = req.userId; // ID do vendedor logado

    const vendedor = await Vendedor.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const estoque = await Peca.find({ vendedor: vendedorId });

    // Consulta para obter a quantidade disponível de um produto específico
    const getQuantidadeDisponivel = async (pecaId) => {
      const peca = await Peca.findById(pecaId);
      return peca.quantidade;
    };

    // Consulta para listar produtos com estoque baixo (quantidade abaixo de um limite pré-definido)
    const limiteEstoqueBaixo = 10; // Defina o limite de estoque baixo conforme necessário
    const produtosEstoqueBaixo = await Peca.find({
      vendedor: vendedorId,
      quantidade: { $lt: limiteEstoqueBaixo },
    });

    // Consulta para listar produtos mais vendidos (ordenados pela quantidade vendida em ordem decrescente)
    const produtosMaisVendidos = await Peca.find({ vendedor: vendedorId })
      .sort('-quantidadeVendida')
      .limit(10); // Defina o número de produtos mais vendidos que deseja retornar

    // Consulta para obter histórico de vendas de um produto específico
    const getHistoricoVendas = async (pecaId) => {
      const historicoVendas = await Venda.find({ peca: pecaId });
      return historicoVendas;
    };

    const estoqueComDetalhes = await Promise.all(
      estoque.map(async (peca) => {
        const limiteEstoqueBaixo = 10; // Defina o limite de estoque baixo conforme necessário
        const produtosEstoqueBaixo = await Peca.find({
        vendedor: vendedorId,
        quantidade: { $lt: limiteEstoqueBaixo },
        });
        const produtosMaisVendidos = await Peca.find({ vendedor: vendedorId })
        .sort('-quantidadeVendida')
        .limit(10); // Defina o número de produtos mais vendidos que deseja retornar


        const quantidadeDisponivel = await getQuantidadeDisponivel(peca._id);
        const historicoVendas = await getHistoricoVendas(peca._id);

        return {
          _id: peca._id,
          nome: peca.nome,
          descricao: peca.descricao,
          preco: peca.preco,
          quantidade: peca.quantidade,
          quantidadeDisponivel,
          historicoVendas,
        };
      })
    );

    res.status(200).json({
      estoque: estoqueComDetalhes,
      produtosEstoqueBaixo,
      produtosMaisVendidos,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
