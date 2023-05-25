const Cliente = require('../models/clientesModels');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../auth/auth');

exports.registerCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, endereco, telefone, dataCadastro } = req.body;

    // Validações dos campos obrigatórios
    if (!nome || !email || !senha || !cpf || !endereco || !telefone || !dataCadastro) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o cliente já está cadastrado
    const existingCliente = await Cliente.findOne({ email });
    if (existingCliente) {
      return res.status(400).json({ message: 'O cliente já está cadastrado' });
    }

    // Criptografar a senha antes de salvar o cliente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const cliente = new Cliente({
      nome,
      email,
      senha: hashedPassword,
      cpf,
      endereco,
      telefone,
      dataCadastro
    });

    const newCliente = await cliente.save();

    // Gerar e retornar o token JWT
    const token = generateToken({ id: newCliente._id });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o cliente existe no banco de dados
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, cliente.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar e retornar o token JWT
    const token = generateToken({ id: cliente._id });
    res.status(200).json({ token });
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
    if (cliente._id.toString() !== req.user._id.toString()) {
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
    if (cliente._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    const deletedCliente = await Cliente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};