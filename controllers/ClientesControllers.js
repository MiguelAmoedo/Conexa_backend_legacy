const Cliente = require('../models/clientesModels');

exports.getClientes = async (req, res) => {
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

exports.createCliente = async (req, res) => {
  try {
    const { cpf, nome, endereco, telefone, email, senha } = req.body;
    const cliente = new Cliente({
      cpf,
      nome,
      endereco,
      telefone,
      email,
      senha
    });
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { cpf, nome, endereco, telefone, email, senha } = req.body;
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        cpf,
        nome,
        endereco,
        telefone,
        email,
        senha
      },
      { new: true }
    );
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClienteByCPF = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ cpf: req.params.cpf });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
