const ClienteLogin   = require('../models/clientesModels');
const FuncionarioLogin = require('../models/VendedorModels')
const jwt = require('jsonwebtoken');
const secretKey = 'chave_secreta_do_token';

exports.loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o cliente existe no banco de dados
    const cliente = await ClienteLogin.findOne({ email, senha });

    if (!cliente) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ id: cliente._id }, secretKey);

    res.status(200).json({ message: 'Login do cliente bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginFuncionario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o funcionário existe no banco de dados
    const funcionario = await FuncionarioLogin.findOne({ email, senha });

    if (!funcionario) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ id: funcionario._id }, secretKey);

    res.status(200).json({ message: 'Login do funcionário bem-sucedido', token });
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

    // Verifica se o token pertence a um cliente ou funcionário
    const cliente = ClienteLogin.findById(decodedToken.id);
    const funcionario = FuncionarioLogin.findById(decodedToken.id);

    if (cliente) {
      return res.status(200).json({ message: 'Token de cliente válido' });
    } else if (funcionario) {
      return res.status(200).json({ message: 'Token de funcionário válido' });
    } else {
      return res.status(401).json({ message: 'Token inválido' });
    }
  });
};
