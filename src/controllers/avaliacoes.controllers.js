import { db } from "../config/db.js"


export async function criarAvaliacao(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        if (!usuario_id || !livro_id || !nota)
            return res.status(400).json({ erro: "Campos obrigatórios: usuario_id, livro_id e nota" });

        await db.execute(
            "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)", [usuario_id, livro_id, nota, comentario]
        );

        res.json({ mensagem: "Avaliação realizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarAvaliacoes(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function buscarAvaliacao(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ erro: "Avaliação não encontrada" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function atualizarAvaliacao(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        await db.execute(
            "UPDATE avaliacoes SET usuario_id = ?, livro_id = ?, nota = ?, comentario = ? WHERE id = ?", [usuario_id, livro_id, nota, comentario, req.params.id]
        );
        res.json({ mensagem: "Avaliação atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function deletarAvaliacao(req, res) {
    try {
        await db.execute("DELETE FROM avaliacoes WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Avaliação deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};