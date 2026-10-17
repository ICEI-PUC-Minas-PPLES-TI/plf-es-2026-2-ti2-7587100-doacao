const chave = 'doacao:eventos-cadastrados:v1';

function retirarEspacos(texto) {
  if (typeof texto !== 'string') return '';

  
  const espacos = [' ', '\t', '\n', '\r'];
  let inicio = 0;
  let fim = texto.length - 1;

  while (inicio <= fim && espacos.includes(texto[inicio])) {
    inicio++;
  }
  while (fim >= inicio && espacos.includes(texto[fim])) {
    fim--;
  }

  let resultado = '';
  for (let i = inicio; i <= fim; i++) {
    resultado += texto[i];
  }
  return resultado;
}

function temSomenteNumeros(texto) {
  if (texto.length === 0) return false;
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] < '0' || texto[i] > '9') return false;
  }
  return true;
}

function horarioEstaValido(horario) {
  if (typeof horario !== 'string' || horario.length !== 5) return false;
  if (horario[2] !== ':') return false;

  const partes = horario.split(':');
  if (!temSomenteNumeros(partes[0]) || !temSomenteNumeros(partes[1])) return false;

  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);
  return horas >= 0 && horas <= 23 && minutos >= 0 && minutos <= 59;
}

function dataEstaValida(data) {
  if (typeof data !== 'string' || data.length !== 10) return false;
  if (data[4] !== '-' || data[7] !== '-') return false;

  const partes = data.split('-');
  for (let i = 0; i < partes.length; i++) {
    if (!temSomenteNumeros(partes[i])) return false;
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  const calendario = new Date(data + 'T12:00:00Z');

  
  return calendario.getUTCFullYear() === ano
    && calendario.getUTCMonth() + 1 === mes
    && calendario.getUTCDate() === dia;
}

export function validarCadastro(dados, agora = new Date()) {
  const erros = {};
  const nome = retirarEspacos(dados.nome);
  const local = retirarEspacos(dados.local);

  if (!nome) {
    erros.nome = 'Informe o nome do evento.';
  } else if (nome.length > 120) {
    erros.nome = 'Use até 120 caracteres.';
  }

  if (!local) {
    erros.local = 'Informe o local.';
  } else if (local.length > 250) {
    erros.local = 'Use até 250 caracteres.';
  }

  if (!dataEstaValida(dados.data)) {
    erros.data = 'Informe uma data válida.';
  }

  if (!horarioEstaValido(dados.horario)) {
    erros.horario = 'Informe um horário válido.';
  }

  if (!erros.data && !erros.horario) {
    const inicioEvento = new Date(dados.data + 'T' + dados.horario);
    if (inicioEvento <= agora) {
      erros.data = 'Escolha uma data e um horário futuros.';
    }
  }

  if ((dados.descricao || '').length > 2000) {
    erros.descricao = 'Use até 2.000 caracteres.';
  }

  return erros;
}

export function lerCadastros(storage) {
  const conteudo = storage.getItem(chave);
  const eventos = JSON.parse(conteudo || '[]');

  if (!Array.isArray(eventos)) {
    throw new Error('Dados locais inválidos.');
  }

  for (const evento of eventos) {
    const camposValidos = evento
      && typeof evento.id === 'string'
      && typeof evento.nome === 'string'
      && typeof evento.local === 'string';
    if (!camposValidos || !dataEstaValida(evento.data) || !horarioEstaValido(evento.horario)) {
      throw new Error('Dados locais inválidos.');
    }
  }

  return eventos;
}

export function salvarCadastro(storage, dados) {
  const erros = validarCadastro(dados);
  if (Object.keys(erros).length > 0) {
    throw new Error('Revise os campos.');
  }

 
  const eventos = lerCadastros(storage);
  const evento = {
    id: crypto.randomUUID(),
    nome: retirarEspacos(dados.nome),
    descricao: retirarEspacos(dados.descricao),
    data: dados.data,
    horario: dados.horario,
    local: retirarEspacos(dados.local),
    participantes: 0
  };

  eventos.push(evento);
  storage.setItem(chave, JSON.stringify(eventos));
  return evento;
}
