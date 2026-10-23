export function validarEvento(entrada, agora = Date.now()) {
  const texto = valor => typeof valor === 'string' ? valor.trim() : '';
  const dados = {
    nome: texto(entrada?.nome), descricao: texto(entrada?.descricao),
    data: texto(entrada?.data), horario: texto(entrada?.horario),
    local: texto(entrada?.local), endereco: texto(entrada?.endereco)
  };
  const erros = {};
  if (!dados.nome || dados.nome.length > 120) erros.nome = 'Informe o nome do evento, com até 120 caracteres.';
  if (!dados.descricao || dados.descricao.length > 4000) erros.descricao = 'Informe a descrição, com até 4.000 caracteres.';
  if (!dados.local || dados.local.length > 160) erros.local = 'Informe o nome do local, com até 160 caracteres.';
  if (!dados.endereco || dados.endereco.length > 240) erros.endereco = 'Informe o endereço, com até 240 caracteres.';
  const data = new Date(dados.data + 'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data) || !Number.isFinite(data.getTime()) || data.toISOString().slice(0, 10) !== dados.data) erros.data = 'Informe uma data válida.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(dados.horario)) erros.horario = 'Informe um horário válido.';
  // Os eventos seguem o horário de brasilia.
  const inicio = new Date(dados.data + 'T' + dados.horario + ':00-03:00');
  if (!erros.data && !erros.horario && inicio.getTime() <= agora) erros.data = 'Escolha uma data e um horário futuros.';
  return { dados, erros, inicio: Object.keys(erros).length ? null : inicio.toISOString() };
}
