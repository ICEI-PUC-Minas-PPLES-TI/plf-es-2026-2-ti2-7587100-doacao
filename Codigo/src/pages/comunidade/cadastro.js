import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { salvarCadastro, validarCadastro, lerCadastros, editarCadastro } from '../../../public/modulos/Lucas-asth-sprint1/js/cadastro';
import styles from '../../../public/modulos/Lucas-asth-sprint1/css/CadastroEvento.module.css';

export default function CadastroEvento() {
  const router = useRouter();
  const id = router.query.editar;
  const editando = typeof id === 'string';
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [dados, setDados] = useState({ nome: '', descricao: '', data: '', horario: '', local: '' });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [criado, setCriado] = useState(null);
  const bloqueio = useRef(false);
  const formulario = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    setCarregando(true);
    setErroCarregamento('');
    setCriado(null);
    setErros({});
    setFalha('');
    try {
      if (typeof id === 'string') {
        const evento = lerCadastros(window.localStorage).find(item => item.id === id);
        if (!evento) {
          setErroCarregamento('Este evento não está disponível para edição neste navegador.');
        } else {
          setDados({ nome: evento.nome, descricao: evento.descricao || '', data: evento.data, horario: evento.horario, local: evento.local });
        }
      } else {
        setDados({ nome: '', descricao: '', data: '', horario: '', local: '' });
      }
    } catch {
      setErroCarregamento('Não foi possível carregar os dados. Tente atualizar a página.');
    } finally {
      setCarregando(false);
    }
  }, [router.isReady, id]);
  
  function atualizarCampo(event) {
    const { name, value } = event.target;
    setDados(anteriores => ({ ...anteriores, [name]: value }));
  }

  function enviar(event) {
    event.preventDefault();
    if (bloqueio.current) return;
    const resultado = validarCadastro(dados);
    setErros(resultado);
    setFalha('');
    const camposComErro = Object.keys(resultado);
    if (camposComErro.length > 0) {
      const primeiroCampo = formulario.current.elements.namedItem(camposComErro[0]);
      primeiroCampo?.focus();
      return;
    }
    bloqueio.current = true;
    setSalvando(true);
    try {
      let evento;
      if (editando) {
        evento = editarCadastro(window.localStorage, id, dados);
      } else {
        evento = salvarCadastro(window.localStorage, dados);
      }
      setCriado(evento);
    } catch {
      setFalha('Não foi possível salvar neste navegador. Seus dados foram mantidos. Verifique se o armazenamento está disponível e tente novamente.');
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }
  if (carregando || erroCarregamento) {
    return <section className={styles.page}>
      <Link href="/comunidade">← Voltar para eventos</Link>
      <p role={erroCarregamento ? 'alert' : 'status'}>{erroCarregamento || 'Carregando formulário…'}</p>
    </section>;
  }

  const destinoCancelar = editando ? '/comunidade/eventos/' + id : '/comunidade';
  let titulo = 'Criar evento';
  if (editando) titulo = 'Editar evento';
  if (criado) titulo = editando ? 'Evento atualizado' : 'Evento criado';

  return <section className={styles.page}>
    <Link href="/comunidade">← Voltar para eventos</Link>
    <h1>{titulo}</h1>
    {criado ? <div className={styles.panel}>
      <p role="status">O evento “{criado.nome}” foi {editando ? 'atualizado' : 'salvo'} com sucesso neste navegador.</p>
      <Link className={styles.primary} href={'/comunidade/eventos/' + criado.id}>Ver evento</Link>
      <Link href="/comunidade">Voltar à lista de eventos</Link>
    </div> : <>
      <p>{editando ? 'Atualize as informações do seu evento.' : 'Divulgue uma ação de doação de sangue.'} Nome, data, horário e local são obrigatórios.</p>
      <p className={styles.notice}>Nesta etapa, o evento fica salvo somente neste navegador.</p>
      <form ref={formulario} className={styles.panel} noValidate onSubmit={enviar} aria-busy={salvando}>
        {Object.keys(erros).length > 0 && <p role="alert" className={styles.error}>Revise os campos indicados abaixo.</p>}
        <div className={styles.field}>
          <label htmlFor="nome">Nome do evento</label>
          <small id="nome-ajuda">Ex.: Mutirão de doação do bairro</small>
          <input
            id="nome"
            name="nome"
            type="text"
            value={dados.nome}
            onChange={atualizarCampo}
            required
            maxLength={120}
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? 'nome-ajuda nome-erro' : 'nome-ajuda'}
          />
          {erros.nome && (
            <span id="nome-erro" className={styles.error}>{erros.nome}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="descricao">Descrição (opcional)</label>
          <small id="descricao-ajuda">Explique como será a ação e o que os participantes precisam saber.</small>
          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            value={dados.descricao}
            onChange={atualizarCampo}
            maxLength={2000}
            aria-invalid={Boolean(erros.descricao)}
            aria-describedby={erros.descricao ? 'descricao-ajuda descricao-erro' : 'descricao-ajuda'}
          />
          {erros.descricao && (
            <span id="descricao-erro" className={styles.error}>{erros.descricao}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="data">Data</label>
          <small id="data-ajuda">Escolha uma data futura.</small>
          <input
            id="data"
            name="data"
            type="date"
            value={dados.data}
            onChange={atualizarCampo}
            required
            aria-invalid={Boolean(erros.data)}
            aria-describedby={erros.data ? 'data-ajuda data-erro' : 'data-ajuda'}
          />
          {erros.data && (
            <span id="data-erro" className={styles.error}>{erros.data}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="horario">Horário</label>
          <small id="horario-ajuda">Informe o horário de início.</small>
          <input
            id="horario"
            name="horario"
            type="time"
            value={dados.horario}
            onChange={atualizarCampo}
            required
            aria-invalid={Boolean(erros.horario)}
            aria-describedby={erros.horario ? 'horario-ajuda horario-erro' : 'horario-ajuda'}
          />
          {erros.horario && (
            <span id="horario-erro" className={styles.error}>{erros.horario}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="local">Local</label>
          <small id="local-ajuda">Informe o nome do espaço e o endereço completo.</small>
          <input
            id="local"
            name="local"
            type="text"
            value={dados.local}
            onChange={atualizarCampo}
            required
            maxLength={250}
            aria-invalid={Boolean(erros.local)}
            aria-describedby={erros.local ? 'local-ajuda local-erro' : 'local-ajuda'}
          />
          {erros.local && (
            <span id="local-erro" className={styles.error}>{erros.local}</span>
          )}
        </div>
        {falha && <p role="alert" className={styles.error}>{falha}</p>}
        <div className={styles.actions}>
          <Link href={destinoCancelar}>Cancelar</Link>
          <button type="submit" disabled={salvando} className={styles.primary}>
            {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Salvar evento'}
          </button>
        </div>
      </form>
    </>}
  </section>;
}
