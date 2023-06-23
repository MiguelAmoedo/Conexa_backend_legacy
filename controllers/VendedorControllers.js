const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Vendedor = require('../models/VendedorModels');
const Peca = require('../models/PecasModels');
const Compra = require('../models/compraModels');
const secretKey = 'secretKey';




const getVendedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendedor = await Vendedor.findById(id);

    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }

    res.json(vendedor);
  } catch (error) {
    console.log('Erro ao buscar vendedor por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar vendedor por ID' });
  }
};

// Função para validar o token do vendedor
const validarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    
    req.vendedorId = decoded.id;
    next();
  });
};

// Controller para autenticação do vendedor
const autenticarVendedor = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const vendedor = await Vendedor.findOne({ email });

    if (!vendedor) {
      return res.status(400).json({ error: 'Vendedor não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, vendedor.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: vendedor._id }, 'secretKey');

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao autenticar vendedor.' });
  }
};

// Controller para adicionar uma nova peça
const adicionarPeca = async (req, res) => {
  const { nome, tipoDePeca, imagem,  marca, modelo, ano, descricao, preco, qtdEstoque, partesVeiculo, dataCadastro } = req.body;

  try {
    // Verificar se a peça já existe para o vendedor
    const pecaExistente = await Peca.findOne({
      nome,
      tipoDePeca,
      partesVeiculo,
      idVendedor: req.vendedorId,
    });

    if (pecaExistente) {
      // Peça já existe, atualizar apenas o campo qtdEstoque
      pecaExistente.qtdEstoque += qtdEstoque;
      await pecaExistente.save();
      res.json({ message: 'Estoque da peça atualizado com sucesso.' });
    } else {
      // Criar uma nova peça
      const novaPeca = new Peca({
        nome,
        tipoDePeca,
        marca,
        imagem,
        modelo,
        ano,
        descricao,
        preco,
        qtdEstoque,
        partesVeiculo,
        dataCadastro,
        idVendedor: req.vendedorId,
        status: 'Disponivel',
      });

      await novaPeca.save();

      res.json({ message: 'Peça adicionada com sucesso.' });
    }
  } catch (error) {
    console.log(error);

    if (error.errors) {
      const errorMessages = {};

      for (let field in error.errors) {
        errorMessages[field] = `Erro na validação do campo "${field}".`;
        console.log(`Erro na validação do campo "${field}".`);
      }

      res.status(400).json({ error: 'Erro de validação.', errors: errorMessages });
    } else {
      res.status(500).json({ error: 'Erro ao adicionar peça.' });
    }
  }
};



const getVendedorPecas = async (req, res) => {
  // Obtém o ID do vendedor a partir do token validado
  const vendedorId = req.vendedorId;

  try {
    // Use o ID do vendedor para consultar o banco de dados e recuperar as peças adicionadas por ele
    const pecas = await Peca.find({ idVendedor: vendedorId });

    // Verificar se existem peças do vendedor
    if (pecas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma peça encontrada para o vendedor.' });
    }

    // Retorne as peças adicionadas pelo vendedor como resposta
    return res.json(pecas);
  } catch (error) {
    // Em caso de erro, retorne uma resposta de erro adequada
    console.log(error);
    return res.status(500).json({ error: 'Erro ao obter as peças do vendedor.' });
  }
};



// Controller para atualizar uma peça existente
const atualizarPeca = async (req, res) => {
  const { id } = req.params;
  const { nome, marca, modelo, ano, descricao, preco, qtdEstoque, partesVeiculo } = req.body;

  try {
    const peca = await Peca.findOneAndUpdate(
      { _id: id, idVendedor: req.vendedorId },
      { nome, marca, modelo, ano, descricao, preco, qtdEstoque, partesVeiculo },
      { new: true }
    );

    if (!peca) {
      return res.status(404).json({ error: 'Peça não encontrada.' });
    }

    res.json({ message: 'Peça atualizada com sucesso.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar peça.' });
  }
};

// Controller para excluir uma peça
const excluirPeca = async (req, res) => {
  const { id } = req.params;

  try {
    const peca = await Peca.findOneAndDelete({ _id: id, idVendedor: req.vendedorId });

    if (!peca) {
      return res.status(404).json({ error: 'Peça não encontrada.' });
    }

    res.json({ message: 'Peça excluída com sucesso.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao excluir peça.' });
  }
};

const visualizarInformacoesPessoais = async (req, res) => {
  try {
    const vendedorId = req.vendedorId;

    const vendedor = await Vendedor.findById(vendedorId);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    res.status(200).json(vendedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarInformacoesPessoais = async (req, res) => {
  try {
    const vendedorId = req.vendedorId;
    const { nome, email } = req.body;

    const vendedor = await Vendedor.findById(vendedorId);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    if (nome) {
      vendedor.nome = nome;
    }
    if (email) {
      vendedor.email = email;
    }

    const vendedorAtualizado = await vendedor.save();
    res.status(200).json(vendedorAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const alterarSenha = async (req, res) => {
  try {
    const vendedorId = req.vendedorId;
    const { senhaAntiga, senhaNova } = req.body;

    const vendedor = await Vendedor.findById(vendedorId);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    if (senhaAntiga !== vendedor.senha) {
      return res.status(401).json({ message: 'Senha antiga inválida' });
    }

    vendedor.senha = senhaNova;
    const vendedorAtualizado = await vendedor.save();
    res.status(200).json(vendedorAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const relatorioVendasVendedor = async (req, res) => {
  try {
    const vendedorId = req.vendedorId; // ID do vendedor logado

    const vendas = await Compra.find({
      'itens.peca': { $in: req.user.pecas }, // Filtra as compras que contenham peças do vendedor (acessível através do req.user)
      status: 'Concluída', // Filtra as compras que estão concluídas
    })
      .populate('cliente', 'nome telefone')
      .populate('itens.peca', 'nome modelo marca precoUnitario')
      .lean();

    const relatorio = vendas.map((venda) => {
      return {
        idCompra: venda._id, // ID da compra
        dataCompra: venda.dataCompra, // Data da compra
        idPeca: venda.itens[0].peca._id, // ID da peça vendida
        idCliente: venda.cliente._id, // ID do cliente
        nomeCliente: venda.cliente.nome, // Nome do cliente
        telefoneCliente: venda.cliente.telefone, // Telefone do cliente

        nomePeca: venda.itens[0].peca.nome, // Nome da peça
        modeloPeca: venda.itens[0].peca.modelo, // Modelo da peça
        marcaPeca: venda.itens[0].peca.marca, // Marca da peça
        precoUnitario: venda.itens[0].precoUnitario, // Preço unitário da peça
        precoTotal: venda.itens[0].precoUnitario * venda.itens[0].quantidade, // Preço total da venda
      };
    });

    res.status(200).json(relatorio);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o relatório de vendas.' });
  }
};


// Outros controllers relacionados às instruções fornecidas

module.exports = {
  validarToken,
  autenticarVendedor,
  adicionarPeca,
  atualizarPeca,
  excluirPeca,
  visualizarInformacoesPessoais,
  atualizarInformacoesPessoais,
  alterarSenha,
  getVendedorPecas,
  getVendedorById,
  relatorioVendasVendedor
  // Outros controllers relacionados às instruções fornecidas
};
