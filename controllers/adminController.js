const Admin = require('../models/adminModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Cliente = require('../models/clientesModels');
const Vendedor = require('../models/VendedorModels');
const Peca = require('../models/PecasModels');
const Compra = require('../models/compraModels');


exports.criarAdmin = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verifica se o admin já está cadastrado
    const adminExistente = await Admin.findOne({ email });

    if (adminExistente) {
      return res.status(400).json({ error: 'Admin já cadastrado.' });
    }

    // Criptografa a senha do admin
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o objeto de admin
    const admin = new Admin({
      nome,
      email,
      senha: senhaCriptografada
    });

    // Salva o admin no banco de dados
    await admin.save();

    res.status(201).json({ message: 'Admin criado com sucesso.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao criar admin.' });
  }
};



exports.loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifique as credenciais do administrador aqui (por exemplo, email e senha)

    // Se as credenciais forem válidas, gere o token
    const token = jwt.sign({ role: 'admin' }, 'chave-secreta-do-token', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Função para validar o token do admin


exports.validarTokenAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
    jwt.verify(token, 'chave_secreta_do_token', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido.' });
      }
      
      req.adminId = decoded.id;
      next();
    });
  };
  



exports.createVendedor = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    const vendedor = new Vendedor({ nome, email, telefone });

    await vendedor.save();

    res.status(201).json(vendedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    const vendedor = await Vendedor.findByIdAndUpdate(
      id,
      { nome, email, telefone },
      { new: true }
    );

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVendedor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendedor = await Vendedor.findByIdAndDelete(id);

    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    res.status(200).json({ message: 'Vendedor excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPeca = async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;

    const peca = new Peca({ nome, descricao, preco });

    await peca.save();

    res.status(201).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePeca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;

    const peca = await Peca.findByIdAndUpdate(
      id,
      { nome, descricao, preco },
      { new: true }
    );

    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePeca = async (req, res) => {
  try {
    const { id } = req.params;

    const peca = await Peca.findByIdAndDelete(id);

    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json({ message: 'Peça excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllVendedores = async (req, res) => {
  try {
    const vendedores = await Vendedor.find();
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendedor = await Vendedor.findById(id);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

exports.getPecaById = async (req, res) => {
  try {
    const { id } = req.params;
    const peca = await Peca.findById(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCompras = async (req, res) => {
  try {
    const compras = await Compra.find();
    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compra.findById(id);
    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compra.findById(id);
    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    compra.status = 'Cancelada';
    await compra.save();
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
