import { useRef, useState } from 'react';
import { useAutenticacao } from '../../autenticacao/contexto';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/EventoDetalhes.module.css';

export default function ExcluirEvento({ evento, onExcluido, onErro }) {
  const dialogo = useRef(null);
  const cancelar = useRef(null);
  const ocupado = useRef(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const { atualizarUsuario } = useAutenticacao();

  function abrir() {
    setErro('');
    dialogo.current.showModal();
    cancelar.current.focus();
  }

  async function excluir() {
    if (ocupado.current) return;
    ocupado.current = true;
    setExcluindo(true);
    setErro('');
    try {
      const resposta = await fetch('/api/eventos/' + evento.id, {
        method: 'DELETE', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirmar: true })
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        const mensagem = resultado.mensagem || 'Não foi possível excluir o evento.';
        if (resposta.status === 401) {
          dialogo.current.close();
          onErro(mensagem);
          atualizarUsuario(null);
        } else setErro(mensagem);
        return;
      }
      dialogo.current.close();
      onExcluido();
    } catch {
      setErro('Não foi possível confirmar a exclusão. Confira a lista de eventos antes de tentar novamente.');
    } finally {
      ocupado.current = false;
      setExcluindo(false);
    }
  }

  return <>
    <button className={styles.deleteTrigger} type="button" onClick={abrir}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
      </svg>
      Excluir
    </button>
    <dialog ref={dialogo} className={styles.dialog} aria-labelledby="titulo-excluir" aria-describedby="descricao-excluir" aria-busy={excluindo} onCancel={evento => { if (ocupado.current) evento.preventDefault(); }}>
      <h2 id="titulo-excluir">Excluir evento?</h2>
      <p id="descricao-excluir">O evento <strong>{evento.nome}</strong> e seus comentários, curtidas e participações serão removidos. Essa ação não pode ser desfeita.</p>
      {erro && <p role="alert" className={styles.error}>{erro}</p>}
      <div className={styles.actions}>
        <button ref={cancelar} type="button" onClick={() => dialogo.current.close()} disabled={excluindo}>Cancelar</button>
        <button type="button" className={styles.confirmDelete} onClick={excluir} disabled={excluindo}>{excluindo ? 'Excluindo…' : 'Excluir evento'}</button>
      </div>
    </dialog>
  </>;
}
