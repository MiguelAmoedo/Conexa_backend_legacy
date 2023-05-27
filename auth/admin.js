
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Admin = require('../models/adminModels');

// Configuração do JWT
const jwtOptions = {
  secretOrKey: 'seuSegredo', // Chave secreta para assinar e verificar os tokens
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrair token do cabeçalho "Authorization"
};

// Função para gerar o token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, jwtOptions.secretOrKey);
};

// Estratégia de autenticação JWT para admin
const adminJwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return done(null, false);
    }
    return done(null, admin);
  } catch (error) {
    return done(error, false);
  }
});

// Inicializar o Passport.js
passport.use('admin-jwt', adminJwtStrategy);

module.exports = {
  generateToken,
  adminAuth: passport.authenticate('admin-jwt', { session: false }),
};
