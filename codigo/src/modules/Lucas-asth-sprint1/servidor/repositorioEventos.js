export async function inserirEvento(dados, autorId, inicio) {
  const { getDb } = await import('../../../lib/mongodb');
  const db = await getDb();
  const documento = {
    tipo: 'EVENTO', autorId, titulo: dados.nome, texto: dados.descricao,
    inicio, localNome: dados.local, endereco: dados.endereco,
    participantes: [], totalParticipantes: 0, curtidas: [], comentarios: [],
    criadoEm: new Date().toISOString()
  };
  const resultado = await db.collection('publicacoes').insertOne(documento);
  return { ...documento, _id: resultado.insertedId.toHexString() };
}
