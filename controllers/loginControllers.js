const Cliente = require('../models/clientesModels');
const Vendedor = require('../models/VendedorModels');
const jwt = require('jsonwebtoken');
const secretKey = 'chave_secreta_do_token';
const bcrypt = require('bcryptjs');
const yup = require('yup');

exports.cadastrarCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, endereco, telefone } = req.body;

    // Verifica se o cliente já está cadastrado
    const clienteExistente = await Cliente.findOne({ email });

    if (clienteExistente) {
      return res.status(400).json({ message: 'Cliente já cadastrado' });
    }

    // Criptografa a senha do cliente
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o objeto de cliente
    const cliente = new Cliente({
      nome,
      email,
      senha: senhaCriptografada,
      cpf,
      endereco,
      telefone,
    });

    // Salva o cliente no banco de dados
    await cliente.save();

    res.status(201).json({ message: 'Cliente cadastrado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o cliente existe no banco de dados
    const cliente = await Cliente.findOne({ email });

    if (!cliente) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ id: cliente._id }, secretKey);

    res.status(200).json({ message: 'Login do cliente bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.cadastrarVendedor = async (req, res) => {
  try {
    const { nome, email, senha, cnpj, endereco, telefone } = req.body;

    // Verifica se o vendedor já está cadastrado
    const vendedorExistente = await Vendedor.findOne({ email });

    if (vendedorExistente) {
      return res.status(400).json({ message: 'Vendedor já cadastrado' });
    }

    // Criptografa a senha do vendedor
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o objeto de vendedor
    const vendedor = new Vendedor({
      nome,
      email,
      senha: senhaCriptografada,
      cnpj,
      endereco,
      telefone,
    });

    // Salva o vendedor no banco de dados
    await vendedor.save();

    res.status(201).json({ message: 'Vendedor cadastrado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginVendedor = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o vendedor existe no banco de dados
    const vendedor = await Vendedor.findOne({ email });

    if (!vendedor) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, vendedor.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ id: vendedor._id }, secretKey);

    res.status(200).json({ message: 'Login do vendedor bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    exports.validarToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const { id, type } = decodedToken;

    if (type === 'cliente') {
      // Verifica se o token pertence a um cliente
      Cliente.findById(id)
        .then((cliente) => {
          if (cliente) {
            return res.status(200).json({ message: 'Token de cliente válido' });
          } else {
            return res.status(401).json({ message: 'Token inválido' });
          }
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else if (type === 'vendedor') {
      // Verifica se o token pertence a um vendedor
      Vendedor.findById(id)
        .then((vendedor) => {
          if (vendedor) {
            return res.status(200).json({ message: 'Token de vendedor válido' });
          } else {
            return res.status(401).json({ message: 'Token inválido' });
          }
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      return res.status(401).json({ message: 'Token inválido' });
    }
  });
};
