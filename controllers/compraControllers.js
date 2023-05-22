const Compra = require('../models/compraModels');
const Peca = require('../models/PecasModels');
const Cliente = require('../models/clientesModels')

exports.adicionarItemCarrinho = async (req, res) => {
  try {
    const { compraId, clienteId, pecaId, quantidade } = req.body;

    // Verifica se o cliente existe
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verifica se a peça existe
    const peca = await Peca.findById(pecaId);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    // Verifica se a peça está disponível em estoque
    if (peca.qtdEstoque <= quantidade) {
      return res.status(400).json({ message: 'Quantidade solicitada excede o estoque disponível' });
    }

    // Calcula o preço total do item
    const precoUnitario = peca.preco;
    const precoTotal = precoUnitario * quantidade;

    // Cria um objeto para representar o item da compra
    const itemCompra = {
      peca: pecaId,
      quantidade,
      precoUnitario,
      precoTotal
    };

    // Verifica se já existe uma compra em andamento para o cliente
    let compraEmAndamento = await Compra.findOne({ cliente: clienteId, status: 'Em andamento' });

    // Se não existe uma compra em andamento, cria uma nova
    if (!compraEmAndamento) {
      compraEmAndamento = new Compra({
        cliente: clienteId,
        itens: [itemCompra]
      });
    } else {
      // Se já existe uma compra em andamento, adiciona o item ao carrinho
      compraEmAndamento.itens.push(itemCompra);
    }

    // Atualiza a quantidade em estoque da peça
    peca.qtdEstoque -= quantidade;
    await peca.save();

    // Salva a compra no banco de dados
    await compraEmAndamento.save();

    res.status(201).json(compraEmAndamento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.finalizarCompra = async (req, res) => {
    try {
        const { compraId } = req.params;
    
        // Verifica se a compra existe
        const compra = await Compra.findById(compraId);
        if (!compra) {
          return res.status(404).json({ message: 'Compra não encontrada' });
        }
    
        // Verifica se a compra já foi finalizada
        if (compra.status !== 'Em andamento') {
          return res.status(400).json({ message: 'A compra já foi finalizada ou cancelada' });
        }
    
      // Atualiza o status da compra para 'Concluída'
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
    
        // Verifica se a compra existe
        const compra = await Compra.findById(compraId);
        if (!compra) {
          return res.status(404).json({ message: 'Compra não encontrada' });
        }
    
        // Verifica se a compra já foi finalizada
        if (compra.status !== 'Em andamento') {
          return res.status(400).json({ message: 'A compra já foi finalizada ou cancelada' });
        }
    
        // Restaura a quantidade em estoque das peças da compra
        const itensCompra = compra.itens;
        for (const item of itensCompra) {
          const peca = await Peca.findById(item.peca);
          if (peca) {
            peca.qtdEstoque += item.quantidade;
            await peca.save();
          }
        }
    
        // Atualiza o status da compra para 'Cancelada'
        compra.status = 'Cancelada';
        await compra.save();
    
        res.status(200).json(compra);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
exports.removerItemCarrinho = async (req, res) => {
        try {
          const { itemId } = req.params;
          const { clienteId } = req.body;
      
          // Verifica se o usuário existe
          const cliente = await Cliente.findById(clienteId);
          if (!cliente) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
          }
      
          // Verifica se o item está no carrinho do usuário
          const itemIndex = cliente.carrinho.findIndex((item) => item.id === itemId);
          if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item não encontrado no carrinho' });
          }
      
          // Remove o item do carrinho
          cliente.carrinho.splice(itemIndex, 1);
      
          // Salva as alterações no banco de dados
          await cliente.save();
      
          res.json({ message: 'Item removido do carrinho com sucesso' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };
      
      exports.obterDetalhesCompra = async (req, res) => {
        try {
          const { compraId } = req.params;
      
          // Verifica se a compra existe
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
          const compras = await Compra.find();
      
          const itensNoCarrinho = compras.filter(compra => compra.status === 'Em andamento');
          const comprasCanceladas = compras.filter(compra => compra.status === 'Cancelada');
          const comprasFinalizadas = compras.filter(compra => compra.status === 'Concluída');
          const itensRemovidos = compras.filter(compra => compra.status !== 'Em andamento' && compra.itens.length === 0);
      
          res.status(200).json({
            itensNoCarrinho,
            comprasCanceladas,
            comprasFinalizadas,
            itensRemovidos
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };
      