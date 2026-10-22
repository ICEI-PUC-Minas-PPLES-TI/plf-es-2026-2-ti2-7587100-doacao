const campo = document.getElementById('pesquisa-centro');
const mensagem = document.getElementById('status');
const lista = document.getElementById('lista');

const formulario = document.getElementById('form-doacao');
const centroEscolhido = document.getElementById('centro-escolhido');

const confirmacao = document.getElementById('confirmacao');
const botaoRegistrar = formulario.querySelector('button[type="submit"]');
const botaoDesfazer = document.getElementById('desfazer');

// usuario fixo de teste ate existir login
const USUARIO_TESTE_ID = '670000000000000000001001';

let centros = [];
let centroSelecionado = null;
let ultimaDoacaoId = null; // id da doacao criada pro desfazer

// faz o get com os centros
async function carregar() {
  mensagem.textContent = 'Carregando centros...';
  try {
    const resposta = await fetch('/api/centros');
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    centros = await resposta.json();
    console.log(`${centros.length} centros carregados.`);
    filtrar();
  } catch (erro) {
    console.error('Falha ao carregar centros:', erro);
    mensagem.textContent = 'Não foi possível carregar os centros. Tente novamente.';
  }
}

const normalizar = texto => texto.toLowerCase();

// mostra na tela o que for encontrado
function mostrar(encontrados) {
  lista.replaceChildren(...encontrados.map(centro => {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = centro.nome;
    botao.addEventListener('click', () => selecionar(centro));
    item.append(botao);
    return item;
  }))
  if (encontrados.length > 0) {
    mensagem.textContent = '';
  } else {
    mensagem.textContent = 'Nenhum centro encontrado.';
  }
}

// aparecer tudo que comeca com as letras digitadas
function filtrar() {
  const termo = normalizar(campo.value.trim());
  const encontrados = centros.filter(centro => normalizar(centro.nome).includes(termo));
  console.log(`Pesquisa "${termo}": ${encontrados.length} centro(s) encontrado(s).`);
  mostrar(encontrados);
}

// guarda o centro clicado e abre o formulario da doacao
function selecionar(centro) {
  centroSelecionado = centro;
  centroEscolhido.textContent = centro.nome;
  formulario.hidden = false;
  console.log('Centro selecionado:', centro.nome);
}

// logica do pop up
campo.addEventListener('input', filtrar);
// pede a confirmmacao da doacao antes de registrar 
formulario.addEventListener('submit', evento => {
  evento.preventDefault(); // faz com que a pagina nao recarregue toda vez que confirma a doacao
  console.log('Registrar clicado. Abrindo pop-up de confirmação para:', centroSelecionado.nome);
  confirmacao.returnValue = ''; // limpa o valor da ultima vez, senao o Esc repetiria a confirmacao anterior
  confirmacao.showModal();
});

// ao fechar o pop-up, so registra se foi pelo botao "confirmo"
confirmacao.addEventListener('close', () => {
  if (confirmacao.returnValue === 'confirmar') {
    console.log('Doação confirmada pelo usuário.');
    registrar();
  } else {
    console.log('Registro cancelado pelo usuário. Nada foi enviado.');
  }
});

botaoDesfazer.addEventListener('click', desfazer);

// POST envia a doacao pro banco 
async function registrar() {
  const corpo = {
    usuarioId: { $oid: USUARIO_TESTE_ID },
    centroId: centroSelecionado._id, // a API ja entrega no formato { $oid: ... }
    chamadoId: null,
    dataHora: new Date(document.getElementById('data-hora').value).toISOString(),
    status: 'REALIZADA',
    volumeMl: Number(document.getElementById('volume').value),
    criadoEm: new Date().toISOString(),
  };
  
  console.log('Enviando doação:', corpo);
  mensagem.textContent = 'Registrando doação...';
  botaoRegistrar.disabled = true; // evita registrar duas vezes com clique duplo

  try {
    const resposta = await fetch('/api/doacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });

    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    // salva o ultimo endereco pro desfazer poder apagar
    ultimaDoacaoId = resposta.headers.get('location').split('/').pop();
    console.log(`Doação registrada (HTTP ${resposta.status}). _id: ${ultimaDoacaoId}`);
    mensagem.textContent = 'Doação registrada.';
    botaoDesfazer.hidden = false;
    formulario.reset();
    formulario.hidden = true;
    centroSelecionado = null;
    alert('Doação registrada com sucesso.');

  } catch (erro) {
    console.error('Falha ao registrar doação:', erro);
    mensagem.textContent = 'Não foi possível registrar a doação. Tente novamente.';

  } finally {
    botaoRegistrar.disabled = false; // reativa o botao
  }
}

// apaga a ultima doacao registrada
async function desfazer() {
  console.log('Desfazendo doação. _id:', ultimaDoacaoId);
  try {
    const resposta = await fetch(`/api/doacoes/${ultimaDoacaoId}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    console.log(`Doação desfeita (HTTP ${resposta.status}). _id: ${ultimaDoacaoId}`);
    mensagem.textContent = 'Registro desfeito.';
    ultimaDoacaoId = null;
    botaoDesfazer.hidden = true;
    alert('Registro da doação desfeito.');

  } catch (erro) {
    console.error('Falha ao desfazer doação:', erro);
    mensagem.textContent = 'Não foi possível desfazer o registro. Tente novamente.';
  }
}


carregar();