import { MongoClient } from 'mongodb';

// le as variaveis do .env com as informacoes de acesso
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;


// Em desenvolvimento o hot-reload reexecuta este módulo; o cache global evita abrir uma conexão nova a cada reload.
const globalCache = globalThis;
if (!globalCache._mongoClientPromise) {
  globalCache._mongoClientPromise = new MongoClient(uri).connect(); // inicia uma conexao "in promise" = em andamento
}
// obs: e importante manter a conexao porque o atlas gratuito tem limite de conexao

// permite o back (next) chamar o getDb (igual no java) e a partir dele realizar consultas ao banco
export async function getDb() {
  const client = await globalCache._mongoClientPromise;
  return client.db(dbName);
}
