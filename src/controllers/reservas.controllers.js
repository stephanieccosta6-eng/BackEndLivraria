import { db } from "../config/db.js";

  export async function  listarReservas  (req, res)  {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id, 
        u.nome AS usuario, 
        l.titulo AS livro,
        r.data_retirada, 
        r.data_devolucao, 
        r.confirmado_email, 
        r.criado_em
      FROM reservas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      INNER JOIN livros l ON r.livro_id = l.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar reservas", detalhes: error.message });
  }
};

  export async function criarReserva (req, res)  {
  try {
    const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;

    if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }
    //VERIFICA SE O STATUS DA RESERVA É ATIVO 
      const [existe] = await db.query(
        `SELECT * FROM reservas 
        WHERE livro_id = ? 
        AND status = 'ativa' 
        AND data_devolucao > NOW()`,
          [livro_id]
        );
        //SE JÁ FOR EXISTENTE A RESERVA NÃO PODE SER FEITA
        if (existe.length > 0) {
          return res.status(400).json({
            erro: "Livro já está reservado no momento.",
                reserva_atual: existe[0]
            });
        }
    

    const [livro] = await db.query("SELECT ativo FROM livros WHERE id = ?", [livro_id]);
    if (livro.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }
    if (livro[0].ativo === 0) {
      return res.status(400).json({ erro: "Livro inativo, não pode ser reservado." });
    }

    await db.query(
      "INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, data_retirada, data_devolucao]
    );

    res.status(201).json({ mensagem: "Reserva criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar reserva", detalhes: error.message });
  }
};

export async function devolverReserva (req, res) {
  try {
    const { id } = req.params;

    //METODO PARA BUSCAR RESERVA
    const [reserva] = await db.query("SELECT data_devolucao FROM reservas WHERE id = ?", [id]);

    if (reserva.length === 0) {
      return res.status(404).json({ erro: "Reserva não encontrada." });
    }

    const hoje = new Date();
    const dataDevolucao = new Date(reserva[0].data_devolucao);

    const atrasado = hoje > dataDevolucao ? 1 : 0;

    await db.query(
  "UPDATE reservas SET em_atraso = ? WHERE id = ?",
  [atrasado, id]
  );

    return res.json({
      mensagem: atrasado
        ? "Livro devolvido com atraso!"
        : "Livro devolvido dentro do prazo!",
      atraso: atrasado
    });

  } catch (error) {
    res.status(500).json({ erro: "Erro ao devolver reserva", detalhes: error.message });
  }
};

export async function excluirReserva (req, res) {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM reservas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Reserva não encontrada" });
    }

    res.json({ mensagem: "Reserva excluída com sucesso" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
