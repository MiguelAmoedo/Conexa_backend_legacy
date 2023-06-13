const Cliente = require('../models/clientesModels');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../auth/auth');
const jwt = require('jsonwebtoken');

// Função para validar o token do cliente
exports.validarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    
    req.clienteId = decoded.id;
    next();
  });
};



exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};


exports.updateCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, endereco, telefone, dataCadastro } = req.body;

    // Validações dos campos obrigatórios
    if (!nome || !email || !senha || !cpf || !endereco || !telefone || !dataCadastro) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o cliente existe no banco de dados
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verificar se o cliente atual está autenticado
    if (cliente._id.toString() !== req.clienteId.toString()) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    // Criptografar a nova senha antes de atualizar o cliente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    cliente.nome = nome;
    cliente.email = email;
    cliente.senha = hashedPassword;
    cliente.cpf = cpf;
    cliente.endereco = endereco;
    cliente.telefone = telefone;
    cliente.dataCadastro = dataCadastro;

    const updatedCliente = await cliente.save();
    res.status(200).json(updatedCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    // Verificar se o cliente existe no banco de dados
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verificar se o cliente atual está autenticado
    if (cliente._id.toString() !== req.clienteId.toString()) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    const deletedCliente = await Cliente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
