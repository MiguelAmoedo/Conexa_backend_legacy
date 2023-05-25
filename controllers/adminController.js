const Admin = require('../models/adminModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'chave_secreta_do_token';
const Vendedor = require('../models/VendedorModels');
const Peca = require('../models/PecasModels');

exports.loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o email do administrador está correto
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'E-mail ou senha inválidos' });
    }

    // Verifica se a senha do administrador está correta
    const isPasswordValid = await bcrypt.compare(senha, admin.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ id: admin._id }, secretKey);

    res.status(200).json({ message: 'Login do administrador bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validarTokenAdmin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Verifica se o token pertence a um administrador
    const admin = Admin.findById(decodedToken.id);

    if (admin) {
      return res.status(200).json({ message: 'Token de administrador válido' });
    } else {
      return res.status(401).json({ message: 'Token inválido' });
    }
  });
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
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, endereco, telefone } = req.body;

    const cliente = new Cliente({
      nome,
      email,
      senha,
      cpf,
      endereco,
      telefone,
    });

    const newCliente = await cliente.save();
    res.status(201).json(newCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, endereco, telefone } = req.body;

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    cliente.nome = nome;
    cliente.email = email;
    cliente.senha = senha;
    cliente.cpf = cpf;
    cliente.endereco = endereco;
    cliente.telefone = telefone;

    const updatedCliente = await cliente.save();
    res.status(200).json(updatedCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await cliente.remove();
    res.status(200).json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getVendedores = async (req, res) => {
    try {
      const vendedores = await Vendedor.find();
      res.status(200).json(vendedores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.addVendedor = async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
  
      const vendedor = new Vendedor({
        nome,
        email,
        senha,
      });
  
      const newVendedor = await vendedor.save();
      res.status(201).json(newVendedor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.updateVendedor = async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
  
      const vendedor = await Vendedor.findById(req.params.id);
  
      if (!vendedor) {
        return res.status(404).json({ message: 'Vendedor não encontrado' });
      }
  
      vendedor.nome = nome;
      vendedor.email = email;
      vendedor.senha = senha;
  
      const updatedVendedor = await vendedor.save();
      res.status(200).json(updatedVendedor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.deleteVendedor = async (req, res) => {
    try {
      const vendedor = await Vendedor.findById(req.params.id);
  
      if (!vendedor) {
        return res.status(404).json({ message: 'Vendedor não encontrado' });
      }
  
      await vendedor.remove();
      res.status(200).json({ message: 'Vendedor removido com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.addPeca = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    const peca = new Peca({
      nome,
      descricao,
      preco,
      quantidade,
    });

    const newPeca = await peca.save();
    res.status(201).json(newPeca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePeca = async (req, res) => {
  try {
    const pecaId = req.params.id;
    const { nome, descricao, preco, quantidade } = req.body;

    const peca = await Peca.findByIdAndUpdate(
      pecaId,
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
    const pecaId = req.params.id;

    const deletedPeca = await Peca.findByIdAndDelete(pecaId);

    if (!deletedPeca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json({ message: 'Peça excluída com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Peca.find();

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEstoque = async (req, res) => {
  try {
    const estoque = await Peca.find();

    res.status(200).json(estoque);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};