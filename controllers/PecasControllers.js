
const Peca = require('../models/PecasModels');
const Vendedor = require('../models/VendedorModels');


exports.getPecas = async (req, res) => {
  const { marca, modelo, ano } = req.query;

  try {
    // Consulte o banco de dados para buscar as peças com os critérios de filtro
    const pecas = await Peca.find({ marca, modelo, ano });

    res.json(pecas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as peças.' });
  }
};


exports.advancedSearch = async (req, res) => {
  const { marca, modelo, ano } = req.query;

  // Verifica se os campos "marca" e "modelo" estão vazios
  if (!marca && !modelo) {
    res.json({
      message: 'Falha na pesquisa',
      result: [],
    });
    return;
  }

  try {
    const filtro = {
      $or: [
        { ano: { $regex: `\\b${ano}\\b`, $options: 'i' } },
        { modelo: { $regex: `\\b${modelo}\\b`, $options: 'i' } },
        { marca: { $regex: `\\b${marca}\\b`, $options: 'i' } },
      ],
    };

    const pecas = await Peca.find(filtro);

    if (marca) {
      const pecasMarca = pecas.filter(peca => peca.marca.toLowerCase() === marca.toLowerCase());
      if (pecasMarca.length > 0) {
        console.log('marca');
        console.log('Retornou resultado', pecasMarca.length);
      } else {
        console.log('marca');
        console.log('Não retornou nada');
      }
    }

    if (modelo) {
      const pecasModelo = pecas.filter(peca => peca.modelo.toLowerCase() === modelo.toLowerCase());
      if (pecasModelo.length > 0) {
        console.log('modelo');
        console.log('Retornou resultado', pecasModelo.length);
      } else {
        console.log('modelo');
        console.log('Não retornou nada');
      }
    }

    if (ano) {
      const pecasAno = pecas.filter(peca => peca.ano.toLowerCase() === ano.toLowerCase());
      if (pecasAno.length > 0) {
        console.log('ano');
        console.log('Retornou resultado', pecasAno.length);
      } else {
        console.log('ano');
        console.log('Não retornou nada');
      }
    }

    // Verifica se os três campos batem
    if (pecas.length > 0 && marca && modelo && ano) {
      res.json({
        message: 'Pesquisa feita com sucesso',
        result: pecas.sort((a, b) => {
          if (
            a.marca.toLowerCase() === marca.toLowerCase() &&
            a.modelo.toLowerCase() === modelo.toLowerCase() &&
            a.ano.toLowerCase() === ano.toLowerCase()
          ) {
            return -1;
          } else {
            return 1;
          }
        }),
      });
    }
    // Verifica se dois dos três campos batem
    else if (pecas.length > 0 && ((marca && modelo) || (marca && ano) || (modelo && ano))) {
      res.json({
        message: 'Dois dos três campos batem',
        result: pecas.sort((a, b) => {
          if (
            (a.marca.toLowerCase() === marca.toLowerCase() && a.modelo.toLowerCase() === modelo.toLowerCase()) ||
            (a.marca.toLowerCase() === marca.toLowerCase() && a.ano.toLowerCase() === ano.toLowerCase()) ||
            (a.modelo.toLowerCase() === modelo.toLowerCase() && a.ano.toLowerCase() === ano.toLowerCase())
          ) {
            return -1;
          } else {
            return 1;
          }
        }),
      });
    }
    // Verifica se um dos três campos bate
    else if (pecas.length > 0 && (marca || modelo || ano)) {
      res.json({
        message: 'Um dos três campos bate',
        result: pecas.sort((a, b) => {
          if (
            a.marca.toLowerCase() === marca.toLowerCase() ||
            a.modelo.toLowerCase() === modelo.toLowerCase() ||
            a.ano.toLowerCase() === ano.toLowerCase()
          ) {
            return -1;
          } else {
            return 1;
          }
        }),
      });
    }
    // Nenhum dos três campos bate
    else {
      res.json({
        message: 'Falha na pesquisa',
        result: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as peças.' });
  }
};




exports.getAllPecas = async (req, res) => {
  try {
    const pecas = await Peca.find();
    res.status(200).json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para obter uma peça por ID
exports.getPecaById = async (req, res) => {
  const { id } = req.params;
  try {
    const peca = await Peca.findById(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para criar uma nova peça
exports.createPeca = async (req, res) => {
  const { idVendedor, ...pecaData } = req.body;
  try {
    const peca = new Peca({ idVendedor, ...pecaData });
    const novaPeca = await peca.save();
    res.status(201).json(novaPeca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para atualizar uma peça existente
exports.updatePeca = async (req, res) => {
  const { id } = req.params;
  const { idVendedor, ...pecaData } = req.body;
  try {
    const peca = await Peca.findByIdAndUpdate(id, { idVendedor, ...pecaData }, { new: true });
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para excluir uma peça existente
exports.deletePeca = async (req, res) => {
  const { id } = req.params;
  try {
    const peca = await Peca.findByIdAndDelete(id);
    if (!peca) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json({ message: 'Peça excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


