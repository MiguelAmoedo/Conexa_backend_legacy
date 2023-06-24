const { validationResult } = require('express-validator');
  const Compra = require('../models/compraModels');
  const Peca = require('../models/PecasModels');
  const Cliente = require('../models/clientesModels')
  const Carrinho = require('../models/carinhoModels')
  const mongoose = require('mongoose');

  exports.adicionarItemCarrinho = async (req, res) => {
    try {
      const { clienteId, pecaId, quantidade } = req.body;

      // Verifique se o cliente e a peça existem
      const [cliente, peca] = await Promise.all([
        Cliente.findById(clienteId),
        Peca.findById(pecaId),
      ]);

      if (!cliente || !peca) {
        return res.status(404).json({ message: 'Cliente ou peça não encontrados.' });
      }

      // Verifique se há estoque suficiente da peça
      if (peca.qtdEstoque < quantidade) {
        console.log ("estoque insufuciente")
        return res.status(400).json({ message: 'Estoque insuficiente da peça.' });
      }

      // Verifique se o carrinho do cliente existe
      let carrinho = await Carrinho.findOne({ cliente: clienteId });

      if (!carrinho) {
        // Se o carrinho não existir, crie um novo carrinho para o cliente
        carrinho = await Carrinho.create({ cliente: clienteId, itens: [] });
      }

      // Verifique se a peça já existe no carrinho do cliente
      const itemExistente = carrinho.itens.find(
        (item) =>
          item.peca.toString() === pecaId &&
          item.precoUnitario === peca.preco
      );

      if (itemExistente) {
        // Aumente a quantidade do item existente
        itemExistente.quantidade += quantidade;
      } else {
        // Obtenha o preço unitário da peça
        const precoUnitario = peca.preco;

        // Calcule o preço total do item
        const precoTotal = quantidade * precoUnitario;

        // Crie um novo item de carrinho com a peça, quantidade, preço unitário e preço total
        const novoItem = {
          peca: pecaId,
          quantidade: quantidade,
          precoUnitario: precoUnitario,
          precoTotal: precoTotal,
        };

        // Adicione o novo item ao carrinho
        carrinho.itens.push(novoItem);
      }

      await carrinho.save();

      // Crie um novo documento de compras com status "Em andamento"
      await Compra.create({ cliente: clienteId, itens: carrinho.itens, status: 'Em andamento' });

      let message = 'Item adicionado ao carrinho com sucesso.';
      if (itemExistente) {
        message = 'Quantidade atualizada no carrinho com sucesso.';
      }

      return res.status(200).json({ message: message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro ao adicionar o item ao carrinho.' });
    }
  };



  exports.getCarrinhos = async (req, res) => {
    try {
      // Recupere os carrinhos de compras
      const carrinhos = await Carrinho.find().populate('cliente', 'nome');

      // Verifique se existem carrinhos de compras
      if (carrinhos.length === 0) {
        return res.status(404).json({ message: 'Nenhum carrinho de compras encontrado.' });
      }

      // Retorne os carrinhos de compras
      res.status(200).json(carrinhos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao recuperar os carrinhos de compras.' });
    }
  };


  exports.getCarrinhoDoCliente = async (req, res) => {
    try {
      const clienteId = req.params.clienteId; // ID do cliente

      // Verificar se o cliente existe no banco de dados
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      // Buscar o carrinho de compras do cliente pelo ID do cliente
      const carrinho = await Carrinho.findOne({ cliente: clienteId }).populate('itens.peca');
      if (!carrinho) {
        return res.status(404).json({ message: 'Carrinho de compras não encontrado' });
      }

      if (carrinho.itens.length === 0) {
        return res.status(200).json({ message: 'Seu carrinho está vazio' });
      }

      res.status(200).json(carrinho);
    } catch (error) {
      res.status(500).json({ message: 'Ocorreu um erro ao recuperar o carrinho de compras do cliente' });
    }
  };



  exports.finalizarCompra = async (req, res) => {
    try {
      const clienteId = req.params.clienteId;

      // Verifique se o cliente existe
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Verifique se o cliente possui um carrinho de compras
      const carrinho = await Carrinho.findOne({ cliente: clienteId });
      if (!carrinho) {
        return res.status(404).json({ message: 'Carrinho de compras não encontrado.' });
      }

      // Verifique se há uma compra em andamento para o cliente
      const compraEmAndamento = await Compra.findOne({ cliente: clienteId, status: 'Em andamento' });
      if (!compraEmAndamento) {
        return res.status(404).json({ message: 'Nenhuma compra em andamento encontrada.' });
      }

      // Atualize os dados da compra em andamento
      compraEmAndamento.itens = carrinho.itens;
      compraEmAndamento.status = 'Concluída';
      compraEmAndamento.carrinho = carrinho._id;

      // Salve as alterações na compra em andamento
      await compraEmAndamento.save();

      // Atualize as quantidades no estoque das peças
      const promises = compraEmAndamento.itens.map(async (item) => {
        try {
          const peca = await Peca.findOneAndUpdate(
            { _id: item.peca },
            { $inc: { qtdEstoque: -item.quantidade } },
            { new: true }
          );
          if (!peca) {
            throw new Error('Peça não encontrada.');
          }

          // Atualize o status da peça para 'Vendida' e crie um novo documento com as informações da peça vendida
          const pecaVendida = new Peca({
            nome: peca.nome,
            tipoDePeca: peca.tipoDePeca,
            marca: peca.marca,
            modelo: peca.modelo,
            ano: peca.ano,
            descricao: peca.descricao,
            preco: peca.preco,
            qtdEstoque: 0, // Defina a quantidade como 0, já que a peça foi vendida
            status: 'Vendida',
            idVendedor: peca.idVendedor,
            partesVeiculo: peca.partesVeiculo,
            idCliente: cliente._id, // Use cliente._id em vez de compraEmAndamento.cliente.id
            idAntigo: peca._id, // Use peca._id em vez de peca.id
          });

          await pecaVendida.save();
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      // Aguarde todas as atualizações do estoque serem concluídas
      await Promise.all(promises);

      // Limpe o carrinho de compras do cliente
      carrinho.itens = [];
      await carrinho.save();

      // Remova o carrinho do cliente
      await Carrinho.findByIdAndRemove(carrinho._id);

      // Obtenha os nomes e valores das peças
      const itensCompra = compraEmAndamento.itens.map(async (item) => {
        try {
          const peca = await Peca.findById(item.peca);
          if (!peca) {
            throw new Error('Peça não encontrada.');
          }
          return {
            nomePeca: peca.nome,
            precoPeca: peca.preco,
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      // Aguarde a obtenção dos nomes e valores das peças
      const itensCompraCompletos = await Promise.all(itensCompra);

      return res.status(200).json({
        message: 'Compra finalizada com sucesso.',
        itensCompra: itensCompraCompletos,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro ao finalizar a compra.' });
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

      return res.status(200).json(compra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

      
  exports.removerItemCarrinho = async (req, res) => {
    try {
      const { pecaId } = req.params;
      const { clienteId } = req.body;

      // Verifica se o cliente existe
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      // Encontra o item no carrinho do cliente pelo ID da peça
      const itemIndex = cliente.itens.findIndex((item) => item.peca.toString() === pecaId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado no carrinho' });
      }

      // Remove o item do carrinho
      cliente.itens.splice(itemIndex, 1);

      // Salva as alterações no banco de dados
      await cliente.save();

      return res.json({ message: 'Item removido do carrinho com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro ao remover o item do carrinho' });
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


      // Controlador para atualizar um carrinho pelo ID
exports.gerenciar = async (req, res) => {
  const { id } = req.params; // ID do carrinho a ser atualizado
  const { cliente, itens } = req.body; // Campos a serem atualizados

  try {
    // Verificar se o carrinho existe
    const carrinho = await Carrinho.findById(id);
    if (!carrinho) {
      return res.status(404).json({ mensagem: 'Carrinho não encontrado' });
    }

    // Validação dos campos
    for (const item of itens) {
      const peca = await Peca.findById(item.peca);
      if (!peca) {
        return res.status(404).json({ mensagem: `Peça com ID ${item.peca} não encontrada` });
      }

      if (item.quantidade === 0) {
        // Remover a peça do carrinho se a quantidade for alterada para 0
        carrinho.itens = carrinho.itens.filter((i) => i.peca.toString() !== item.peca);
      } else if (item.quantidade > peca.qtdEstoque) {
        // Quantidade máxima do estoque atingida
        return res.status(400).json({ mensagem: `Quantidade máxima do estoque (${peca.qtdEstoque}) atingida para a peça com ID ${item.peca}` });
      }
    }

    // Atualizar os campos do carrinho
    carrinho.cliente = cliente;
    carrinho.itens = itens;

    // Salvar as alterações
    await carrinho.save();

    res.json({ mensagem: 'Carrinho atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao atualizar o carrinho' });
  }
};

exports.ola = async (req, res) => {
  try {
    const { carrinhoId } = req.params;

    // Encontrar e deletar o carrinho pelo ID do carrinho
    const carrinho = await Carrinho.findByIdAndDelete(carrinhoId);

    if (!carrinho) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' });
    }

    res.status(200).json({ message: 'Carrinho deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o carrinho.' });
  }
};



