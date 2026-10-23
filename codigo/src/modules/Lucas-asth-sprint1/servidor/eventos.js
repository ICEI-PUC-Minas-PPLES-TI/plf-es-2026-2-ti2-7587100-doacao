// Este módulo é importado somente pelas rotas de API do Next.js.
export function idValido(id) {
  if (typeof id !== 'string' || id.length !== 24) return false;
  const caracteres = '0123456789abcdef';
  for (const letra of id.toLowerCase()) {
    if (!caracteres.includes(letra)) return false;
  }
  return true;
}

export function apresentarEvento(documento) {
  if (!documento || documento.tipo !== 'EVENTO') return null;
  let id = documento._id;
  if (id && typeof id === 'object') id = typeof id.toHexString === 'function' ? id.toHexString() : id.$oid;
  let inicio = documento.inicio;
  if (inicio && typeof inicio === 'object' && !(inicio instanceof Date)) inicio = inicio.$date;
  const data = new Date(inicio);
  if (!idValido(id) || !inicio || !Number.isFinite(data.getTime()) || typeof documento.titulo !== 'string') return null;

  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(data);
  const valores = {};
  for (const parte of partes) valores[parte.type] = parte.value;

  return {
    id,
    nome: documento.titulo,
    descricao: typeof documento.texto === 'string' ? documento.texto : '',
    data: valores.year + '-' + valores.month + '-' + valores.day,
    horario: valores.hour + ':' + valores.minute,
    local: typeof documento.localNome === 'string' ? documento.localNome : 'Local não informado',
    endereco: typeof documento.endereco === 'string' ? documento.endereco : '',
    participantes: Number.isInteger(documento.totalParticipantes) && documento.totalParticipantes >= 0 ? documento.totalParticipantes : null
  };
}

export async function consultarEventos(pagina, id) {
  const endereco = process.env.RESTHEART_URL || 'http://127.0.0.1:8080';
  const url = new URL(endereco);
  if (url.username || url.password || !['http:', 'https:'].includes(url.protocol)) throw new Error('Configuração inválida.');
  if (url.protocol !== 'https:' && !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) throw new Error('HTTPS obrigatório fora do computador local.');
  url.pathname = '/publicacoes';
  url.search = '';
  const filtro = { tipo: 'EVENTO' };
  if (id) {
    if (!idValido(id)) throw new Error('Id inválido.');
    filtro.$or = [{ _id: { $oid: id } }, { _id: id }];
  }
  url.searchParams.set('filter', JSON.stringify(filtro));
  url.searchParams.set('page', String(pagina));
  url.searchParams.set('pagesize', id ? '1' : '20');
  url.searchParams.set('sort', JSON.stringify({ inicio: 1, _id: 1 }));

  const resposta = await fetch(url, {
    method: 'GET', headers: { Accept: 'application/json' },
    cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000)
  });
  // Uma coleção ainda não criada significa que não há eventos cadastrados.
  if (resposta.status === 404) return [];
  if (!resposta.ok) throw new Error('Não foi possível consultar o banco.');
  const documentos = await resposta.json();
  if (!Array.isArray(documentos)) throw new Error('Resposta inválida do banco.');
  return documentos.map(apresentarEvento).filter(evento => evento !== null);
}
