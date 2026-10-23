import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ContextoAutenticacao = createContext(null);

export function AutenticacaoProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const versao = useRef(0);

  useEffect(() => {
    let ativo = true;
    const consulta = versao.current;
    fetch('/api/autenticacao/sessao', { cache: 'no-store', credentials: 'same-origin' })
      .then(async resposta => {
        if (!resposta.ok) throw new Error();
        const dados = await resposta.json();
        if (ativo && consulta === versao.current) setUsuario(dados.usuario);
      })
      .catch(() => { if (ativo && consulta === versao.current) setErro('Não foi possível conferir seu acesso.'); })
      .finally(() => { if (ativo && consulta === versao.current) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  function atualizarUsuario(valor) {
    versao.current += 1;
    setUsuario(valor);
    setErro('');
    setCarregando(false);
  }

  async function sair() {
    setErro('');
    try {
      const resposta = await fetch('/api/autenticacao/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!resposta.ok) throw new Error();
      atualizarUsuario(null);
      return true;
    } catch {
      setErro('Não foi possível sair. Tente novamente.');
      return false;
    }
  }

  return <ContextoAutenticacao.Provider value={{ usuario, carregando, erro, atualizarUsuario, sair }}>{children}</ContextoAutenticacao.Provider>;
}

export function useAutenticacao() {
  return useContext(ContextoAutenticacao);
}
