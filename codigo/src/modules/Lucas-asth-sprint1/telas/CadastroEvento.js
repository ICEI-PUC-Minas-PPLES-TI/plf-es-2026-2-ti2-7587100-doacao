import Link from 'next/link';
import { useRef, useState } from 'react';
import { useAutenticacao } from '../../autenticacao/contexto';
import { validarEvento } from '../validarEvento';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/CadastroEvento.module.css';

export default function CadastroEvento({ eventoInicial = null }) {
  const editando = Boolean(eventoInicial);
  const { usuario, carregando, erro: erroAcesso, atualizarUsuario } = useAutenticacao();
  const [dados, setDados] = useState({ nome: eventoInicial?.nome || '', descricao: eventoInicial?.descricao || '', data: eventoInicial?.data || '', horario: eventoInicial?.horario || '', local: eventoInicial?.local || '', endereco: eventoInicial?.endereco || '' });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [criado, setCriado] = useState(null);
  const ocupado = useRef(false);
  const formulario = useRef(null);

  function alterar(evento) {
    const { name, value } = evento.target;
    setDados(anterior => ({ ...anterior, [name]: value }));
    setErros(anterior => ({ ...anterior, [name]: '' }));
    setMensagem('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (ocupado.current || criado) return;
    const validacao = validarEvento(dados);
    setErros(validacao.erros);
    setMensagem('');
    if (Object.keys(validacao.erros).length) {
      formulario.current.elements.namedItem(Object.keys(validacao.erros)[0])?.focus();
      return;
    }
    ocupado.current = true;
    setEnviando(true);
    try {
      const resposta = await fetch(editando ? '/api/eventos/' + eventoInicial.id : '/api/eventos', {
        method: editando ? 'PUT' : 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validacao.dados)
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErros(resultado.erros || {});
        setMensagem(resultado.mensagem || 'Não foi possível salvar o evento.');
        if (resposta.status === 401) atualizarUsuario(null);
        return;
      }
      setCriado(resultado.evento);
    } catch {
      setMensagem('Não foi possível confirmar a gravação. Confira os dados do evento antes de tentar novamente.');
    } finally {
      ocupado.current = false;
      setEnviando(false);
    }
  }

  function campo(nome, rotulo, tipo = 'text', limite) {
    const propriedades = { id: nome, name: nome, value: dados[nome], onChange: alterar, required: true, maxLength: limite, 'aria-invalid': Boolean(erros[nome]), 'aria-describedby': erros[nome] ? `${nome}-erro` : undefined };
    return <div className={styles.field}>
      <label htmlFor={nome}>{rotulo}</label>
      {nome === 'descricao' ? <textarea {...propriedades} rows={5} /> : <input {...propriedades} type={tipo} />}
      {erros[nome] && <span id={`${nome}-erro`} className={styles.error}>{erros[nome]}</span>}
    </div>;
  }

  return (
    <section className={styles.page}>
      <Link href="/comunidade">← Voltar para eventos</Link>
      <h1>{editando ? 'Editar evento' : 'Cadastrar evento'}</h1>
      {carregando ? <p role="status">Conferindo seu acesso…</p> : criado ? <div className={styles.panel}>
        <p role="status"><strong>{editando ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!'}</strong></p>
        <p>{criado.nome} já está salvo no banco.</p>
        <Link href={'/comunidade/eventos/' + criado.id}>Ver evento</Link>
        <Link href="/comunidade">Voltar para a lista</Link>
      </div> : !usuario ? <div className={styles.panel}>
        <p role={mensagem || erroAcesso ? 'alert' : undefined}>{mensagem || erroAcesso || 'Entre na sua conta para salvar o evento.'}</p>
        <Link href="/login" className={styles.primary}>Entrar</Link>
        <Link href="/cadastro">Criar conta</Link>
      </div> : <>
        <p>{editando ? 'Atualize as informações do seu evento.' : 'Organize um encontro e mobilize a comunidade.'}</p>
        <p className={styles.notice}>Todos os campos são obrigatórios. Use o horário de Brasília.</p>
        <form className={styles.panel} ref={formulario} onSubmit={enviar} noValidate aria-busy={enviando}>
          {campo('nome', 'Nome do evento', 'text', 120)}
          {campo('descricao', 'Descrição', 'text', 4000)}
          {campo('data', 'Data', 'date')}
          {campo('horario', 'Horário', 'time')}
          {campo('local', 'Nome do local', 'text', 160)}
          {campo('endereco', 'Endereço completo', 'text', 240)}
          {mensagem && <p className={styles.error} role="alert">{mensagem}</p>}
          <div className={styles.actions}>
            <Link href="/comunidade">Cancelar</Link>
            <button className={styles.primary} type="submit" disabled={enviando}>{enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar evento'}</button>
          </div>
        </form>
      </>}
    </section>
  );
}
