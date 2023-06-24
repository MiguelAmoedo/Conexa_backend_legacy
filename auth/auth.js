/*
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Vendedor = require('../models/VendedorModels');
const Cliente = require('../models/clientesModels');

// Configuração do JWT
const jwtOptions = {
  secretOrKey: 'seuSegredo', // Chave secreta para assinar e verificar os tokens
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrair token do cabeçalho "Authorization"
};

// Função para gerar o token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, jwtOptions.secretOrKey);
};

// Estratégia de autenticação JWT para vendedores
const vendedorJwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const vendedor = await Vendedor.findById(payload.id);
    if (!vendedor) {
      return done(null, false);
    }
    return done(null, vendedor);
  } catch (error) {
    return done(error, false);
  }
});

// Estratégia de autenticação JWT para clientes
const clienteJwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const cliente = await Cliente.findById(payload.id);
    if (!cliente) {
      return done(null, false);
    }
    return done(null, cliente);
  } catch (error) {
    return done(error, false);
  }
});

// Inicializar o Passport.js
passport.use('vendedor-jwt', vendedorJwtStrategy);
passport.use('cliente-jwt', clienteJwtStrategy);

module.exports = {
  generateToken,
  vendedorAuth: passport.authenticate('vendedor-jwt', { session: false }),
  clienteAuth: passport.authenticate('cliente-jwt', { session: false }),
};

*/