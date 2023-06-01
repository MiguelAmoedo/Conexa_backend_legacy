const Peca = require('../models/PecasModels'); 

exports.buscaPeca = async (req, res) => {
  const { ano, modelo, marca } = req.query;

  // Validação dos parâmetros de entrada
  if (!ano || !modelo || !marca) {
    return res.status(400).json({ error: 'Parâmetros de entrada inválidos.' });
  }

  if (isNaN(ano)) {
    return res.status(400).json({ error: 'O ano deve ser um valor numérico.' });
  }

  // Conversão do ano para número
  const anoNumber = parseInt(ano);

  try {
    // Consulta de peças compatíveis com os filtros informados
    const pecas = await Peca.find({ ano: anoNumber, modelo, marca });

    return res.json(pecas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar as peças.' });
  }
};


