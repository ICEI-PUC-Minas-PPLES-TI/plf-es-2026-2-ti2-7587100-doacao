export function validarAcesso(entrada, cadastro = false) {
  const texto = (valor) => typeof valor === 'string' ? valor : '';
  const dados = {
    nome: texto(entrada?.nome).trim(),
    email: texto(entrada?.email).trim().toLowerCase(),
    senha: texto(entrada?.senha),
    confirmacao: texto(entrada?.confirmacao)
  };
  const erros = {};
  if (cadastro && (!dados.nome || dados.nome.length > 120)) erros.nome = 'Informe seu nome, com até 120 caracteres.';
  if (dados.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.email = 'Informe um e-mail válido.';
  if (dados.senha.length < 7 || dados.senha.length > 30) erros.senha = 'Use entre 7 e 30 caracteres.';
  if (cadastro && dados.confirmacao !== dados.senha) erros.confirmacao = 'As senhas precisam ser iguais.';
  return { dados, erros };
}
