import { ObjectId } from 'mongodb';
import { hashToken } from './seguranca';

let preparando;
async function banco() {
  const { getDb } = await import('../../../lib/mongodb');
  const db = await getDb();
  if (!preparando) {
    preparando = Promise.all([
      db.collection('usuarios').createIndex({ emailNormalizado: 1 }, { unique: true, partialFilterExpression: { emailNormalizado: { $type: 'string' } }, name: 'email_normalizado_unico' }),
      db.collection('sessoes').createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection('sessoes').createIndex({ expiraEm: 1 }, { expireAfterSeconds: 0 }),
      db.collection('limites_autenticacao').createIndex({ expiraEm: 1 }, { expireAfterSeconds: 0 })
    ]).catch(erro => { preparando = undefined; throw erro; });
  }
  await preparando;
  return db;
}

export async function buscarUsuarioPorEmail(email) {
  const db = await banco();
  return db.collection('usuarios').findOne({ $or: [{ emailNormalizado: email }, { email }] }, { collation: { locale: 'en', strength: 2 } });
}

export async function cadastrarUsuario(dados) {
  const db = await banco();
  const usuario = { nome: dados.nome, email: dados.email, emailNormalizado: dados.email, senhaHash: dados.senhaHash, papeis: ['USUARIO'], criadoEm: new Date() };
  const resultado = await db.collection('usuarios').insertOne(usuario);
  return { ...usuario, _id: resultado.insertedId };
}

export async function registrarSessao(sessao) {
  const db = await banco();
  await db.collection('sessoes').insertOne({ ...sessao, usuarioId: new ObjectId(String(sessao.usuarioId)) });
}

export async function buscarSessao(tokenHash) {
  const db = await banco();
  return db.collection('sessoes').findOne({ tokenHash });
}

export async function buscarUsuarioPorId(id) {
  if (!ObjectId.isValid(String(id))) return null;
  const db = await banco();
  return db.collection('usuarios').findOne({ _id: new ObjectId(String(id)) }, { projection: { nome: 1, email: 1, papeis: 1 } });
}

export async function removerSessao(tokenHash) {
  const db = await banco();
  await db.collection('sessoes').deleteOne({ tokenHash });
}

export async function permitirTentativa(chave, limite) {
  const db = await banco();
  const janela = Math.floor(Date.now() / 900000);
  const _id = hashToken(`${chave}:${janela}`);
  const resultado = await db.collection('limites_autenticacao').findOneAndUpdate(
    { _id }, { $inc: { tentativas: 1 }, $setOnInsert: { expiraEm: new Date((janela + 2) * 900000) } },
    { upsert: true, returnDocument: 'after' }
  );
  return resultado.tentativas <= limite;
}
