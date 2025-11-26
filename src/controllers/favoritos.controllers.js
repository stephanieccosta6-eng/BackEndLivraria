import { db } from "../config/db.js";

export async function listarFavoritos(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id, 
        u.nome AS usuario, 
        l.titulo AS livro, 
        f.data_favoritado
      FROM favoritos f
      INNER JOIN usuarios u ON f.usuario_id = u.id
      INNER JOIN livros l ON f.livro_id = l.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar favoritos", detalhes: error.message });
  }
};

 export async function  criarFavorito  (req, res)  {
  try {
    const { usuario_id, livro_id } = req.body;

    if (!usuario_id || !livro_id) {
      return res.status(400).json({ erro: "Usuário e livro são obrigatórios." });
    }

    
    const [livro] = await db.query("SELECT ativo FROM livros WHERE id = ?", [livro_id]);
    if (livro.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }
    if (livro[0].ativo === 0) {
      return res.status(400).json({ erro: "Livro inativo, não pode ser favoritado." });
    }

    await db.query(
      "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
      [usuario_id, livro_id]
    );

    res.status(201).json({ mensagem: "Livro adicionado aos favoritos!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar favorito", detalhes: error.message });
  }
};

 export async function    excluirFavorito  (req, res) {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM favoritos WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Favorito não encontrado." });
    }

    res.json({ mensagem: "Favorito removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir favorito", detalhes: error.message });
  }
};

export async function listarFavoritosPorUsuario(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        f.id AS favorito_id,
        u.nome AS usuario,
        l.titulo AS livro,
        f.data_favoritado
      FROM favoritos f
      INNER JOIN usuarios u ON f.usuario_id = u.id
      INNER JOIN livros l ON f.livro_id = l.id
      WHERE f.usuario_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum livro favoritado encontrado para este usuário." });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar favoritos", detalhes: error.message });
  }
};