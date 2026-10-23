import { ObjectId } from 'mongodb';

function filtroDoAutor(id, autorId) {
  return {
    tipo: 'EVENTO',
    _id: { $in: [id, new ObjectId(id)] },
    autorId: { $in: [autorId, new ObjectId(autorId)] }
  };
}

export async function eventoDoAutor(id, autorId) {
  const { getDb } = await import('../../../lib/mongodb');
  const db = await getDb();
  return db.collection('publicacoes').findOne(filtroDoAutor(id, autorId), { projection: { _id: 1 } });
}

export async function atualizarEvento(id, autorId, dados, inicio) {
  const { getDb } = await import('../../../lib/mongodb');
  const db = await getDb();
  // A autoria também faz parte do filtro da gravação, impedindo alterações em eventos de outra pessoa.
  return db.collection('publicacoes').findOneAndUpdate(filtroDoAutor(id, autorId), {
    $set: { titulo: dados.nome, texto: dados.descricao, inicio, localNome: dados.local, endereco: dados.endereco, atualizadoEm: new Date().toISOString() }
  }, { returnDocument: 'after' });
}

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
