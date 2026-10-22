const campo = document.getElementById('pesquisa-centro');
const mensagem = document.getElementById('status');
const lista = document.getElementById('lista');

let centros = [];

// faz o get com os centros
async function carregar() {
  mensagem.textContent = 'Carregando centros...';
  try {
    const resposta = await fetch('/api/centros');
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    centros = await resposta.json();
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
    item.textContent = centro.nome; 
    return item;
  }));
  mensagem.textContent = encontrados.length ? '' : 'Nenhum centro encontrado.';
}
// aparecer tudo que comeca com as letras digitadas
function filtrar() {
  const termo = normalizar(campo.value.trim());
  mostrar(centros.filter(centro => normalizar(centro.nome).includes(termo)));
}


campo.addEventListener('input', filtrar);
carregar();
