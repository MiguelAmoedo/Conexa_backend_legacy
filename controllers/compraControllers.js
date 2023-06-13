const Compra = require('../models/compraModels');
const Peca = require('../models/PecasModels');
const Cliente = require('../models/clientesModels');
const Transacao = require('../models/transacaoModels');

exports.adicionarItemCarrinho = async (req, res) => {
  try {
    const { compraId, clienteId, pecaId, quantidade } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const peca = await Peca.findById(pecaId);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ message: 'A quantidade deve ser um número positivo' });
    }

    if (peca.qtdEstoque < quantidade) {
      return res.status(400).json({ message: 'Quantidade solicitada excede o estoque disponível' });
    }

    const precoUnitario = peca.preco;
    const precoTotal = precoUnitario * quantidade;

    peca.qtdEstoque -= quantidade;
    await peca.save();

    const itemCompra = {
      peca: pecaId,
      quantidade,
      precoUnitario,
      precoTotal
    };

    let compraEmAndamento = await Compra.findOne({ cliente: clienteId, status: 'Em andamento' });

    if (!compraEmAndamento) {
      compraEmAndamento = new Compra({
        cliente: clienteId,
        itens: [itemCompra]
      });
    } else {
      compraEmAndamento.itens.push(itemCompra);
    }

    if (!cliente.carrinho) {
      cliente.carrinho = [];
    }

    cliente.carrinho.push(itemCompra);
    await cliente.save();

    await compraEmAndamento.save();

    res.status(201).json(compraEmAndamento);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errorMessage = 'Erro de validação:';
      for (let field in error.errors) {
        errorMessage += ` ${error.errors[field].message}`;
      }
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.finalizarCompra = async (req, res) => {
  try {
    const { compraId } = req.params;

    const compra = await Compra.findById(compraId);
    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    if (compra.status !== 'Em andamento') {
      return res.status(400).json({ message: 'A compra já foi finalizada ou cancelada' });
    }

    compra.status = 'Concluída';
    await compra.save();

    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelarCompra = async (req, res) => {
  try {
    const { compraId } = req.params;

    const compra = await Compra.findById(compraId);
    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    if (compra.status !== 'Em andamento') {
      return res.status(400).json({ message: 'A compra já foi finalizada ou cancelada' });
    }

    const hasTransactions = await Transacao.exists({ compra: compraId });
    if (hasTransactions) {
      return res.status(400).json({ message: 'Não é possível cancelar uma compra com transações associadas' });
    }

    const session = await Compra.startSession();
    session.startTransaction();

    try {
      const itensCompra = compra.itens;
      for (const item of itensCompra) {
        const peca = await Peca.findById(item.peca);
        if (peca) {
          peca.qtdEstoque += item.quantidade;
          await peca.save();
        }
      }

      compra.status = 'Cancelada';
      await compra.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(compra);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removerItemCarrinho = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { clienteId } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!cliente.carrinho || !Array.isArray(cliente.carrinho)) {
      return res.status(400).json({ message: 'Carrinho inválido' });
    }

    const itemIndex = cliente.carrinho.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item não encontrado no carrinho' });
    }

    cliente.carrinho.splice(itemIndex, 1);

    await cliente.save();

    res.json({ message: 'Item removido do carrinho com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.obterDetalhesCompra = async (req, res) => {
  try {
    const { compraId } = req.params;

    const compra = await Compra.findById(compraId);

    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCompras = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const totalCompras = await Compra.countDocuments();
    const totalPages = Math.ceil(totalCompras / limitNumber);

    const compras = await Compra.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const comprasRestantes = compras.filter((compra) => compra.status !== 'Em andamento' && compra.status !== 'Cancelada');

    res.status(200).json({
      pageNumber,
      totalPages,
      totalCompras,
      compras: comprasRestantes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.pesquisarPecas = async (req, res) => {
  try {
    const { keyword, maxPrice, location } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { nome: { $regex: keyword, $options: 'i' } },
        { descricao: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (maxPrice) {
      filter.preco = { $lte: parseInt(maxPrice) };
    }

    if (location) {
      filter.localizacao = { $regex: location, $options: 'i' };
    }

    const pecas = await Peca.find(filter);

    res.status(200).json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
