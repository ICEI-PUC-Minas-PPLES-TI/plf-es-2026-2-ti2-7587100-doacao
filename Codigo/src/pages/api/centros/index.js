import { getDb } from '@/lib/mongodb';

// trava pra impedir requisicoes que nao gets
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  // get de todos os pontos de coleta
  try {
    const db = await getDb();
    const centros = await db.collection('centros').find({}).toArray();
    return res.status(200).json(centros);
  } catch (err) {
    console.error('GET /api/centros falhou:', err);
    return res.status(500).json({ erro: 'Erro interno ao listar centros' });
  }
}
