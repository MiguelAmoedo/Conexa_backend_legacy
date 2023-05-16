const BuscaPeca = require('../models/BuscaPeca');

// Controlador para filtrar e buscar peças
async function buscarPecas(req, res) {
  try {
    const { marca, ano, modelo, parteVeiculo } = req.query;

    // Construir o filtro de busca
    const filtro = {
      marca: { $regex: marca, $options: 'i' },
      ano: parseInt(ano),
      modelo: { $regex: modelo, $options: 'i' },
      partesVeiculo: parteVeiculo
    };

    // Buscar as peças com base no filtro
    const pecasEncontradas = await BuscaPeca.find(filtro);

    res.json(pecasEncontradas);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao buscar as peças.' });
  }
}

module.exports = {
  buscarPecas
};