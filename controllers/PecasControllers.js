
const Peca = require('../models/PecasModels');
const Vendedor = require('../models/VendedorModels');

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

// Método para gerar relatórios de peças
exports.relatoriosPecas = async (req, res) => {
  // Lógica para gerar relatórios de peças
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
