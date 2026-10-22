import Link from 'next/link';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/CadastroEvento.module.css';

export default function CadastroEvento() {
  return (
    <section className={styles.page}>
      <h1>Cadastro de eventos indisponível</h1>
      <p>Para proteger os eventos da comunidade, cadastro, edição e exclusão serão liberados após a integração do login.</p>
      <Link href="/comunidade">Voltar para eventos</Link>
    </section>
  );
}
