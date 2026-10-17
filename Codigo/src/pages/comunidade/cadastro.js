import Link from 'next/link';
import { useRef, useState } from 'react';
import { salvarCadastro, validarCadastro } from '../../../public/modulos/Lucas-asth-sprint1/js/cadastro';
import styles from '../../styles/CadastroEvento.module.css';

export default function CadastroEvento() {
  const [dados, setDados] = useState({ nome: '', descricao: '', data: '', horario: '', local: '' });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [criado, setCriado] = useState(null);
  const bloqueio = useRef(false);
  const formulario = useRef(null);
  
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
      const evento = salvarCadastro(window.localStorage, dados);
      setCriado(evento);
    } catch {
      setFalha('Não foi possível salvar neste navegador. Seus dados foram mantidos. Verifique se o armazenamento está disponível e tente novamente.');
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }
  return <section className={styles.page}>
    <Link href="/comunidade">← Voltar para eventos</Link>
    <h1>{criado ? 'Evento criado' : 'Criar evento'}</h1>
    {criado ? <div className={styles.panel}>
      <p role="status">O evento “{criado.nome}” foi salvo com sucesso neste navegador.</p>
      <Link className={styles.primary} href={'/comunidade/eventos/' + criado.id}>Ver evento</Link>
      <Link href="/comunidade">Voltar à lista de eventos</Link>
    </div> : <>
      <p>Divulgue uma ação de doação de sangue. Nome, data, horário e local são obrigatórios.</p>
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
        <div className={styles.actions}><Link href="/comunidade">Cancelar</Link><button disabled={salvando} className={styles.primary}>{salvando ? 'Salvando…' : 'Salvar evento'}</button></div>
      </form>
    </>}
  </section>;
}
