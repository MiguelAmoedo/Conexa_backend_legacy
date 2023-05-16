const Vendedor = require('../models/VendedorModels')

exports.getVendedores = async (req, res) => {
  try {
    const vendedor = await Vendedor.find();
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getVendedorById = async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.params.id);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.createVendedor = async (req, res) => {
  try {
    const { nome, email, senha, cnpj, endereco, telefone, dataCadastro, status } = req.body;

    // Validações dos campos obrigatórios
    if (!nome || !email || !senha || !cnpj || !endereco || !telefone || !dataCadastro || !status) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const vendedor = new Vendedor({
      nome,
      email,
      senha,
      cnpj,
      endereco,
      telefone,
      dataCadastro,
      status
    });

    const newVendedor = await vendedor.save();
    res.status(201).json(newVendedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateVendedor = async (req, res) => {
  try {
    const { nome, email, senha, cnpj, endereco, telefone, dataCadastro, status } = req.body;

    // Validações dos campos obrigatórios
    if (!nome || !email || !senha || !cnpj || !endereco || !telefone || !dataCadastro || !status) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const updatedVendedor = await Vendedor.findByIdAndUpdate(req.params.id, {
      nome,
      email,
      senha,
      cnpj,
      endereco,
      telefone,
      dataCadastro,
      status
    }, { new: true });

    if (!updatedVendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    res.status(200).json(updatedVendedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.deleteVendedor = async (req, res) => {
  try {
    const deletedVendedor = await Vendedor.findByIdAndDelete(req.params.id);

    if (!deletedVendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado' });
    }

    res.status(200).json({ message: 'Vendedor excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
