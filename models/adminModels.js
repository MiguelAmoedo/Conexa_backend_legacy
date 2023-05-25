const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Admin', AdminSchema);
