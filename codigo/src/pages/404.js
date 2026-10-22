import Link from "next/link";
import styles from "@/styles/Error404.module.css";

export default function Custom404() {
  return (
    <div className={styles.container404}>
      <img className={styles.errorMascote} src="/404.png" alt="Error 404" />
      <h1 className={styles.errorTitle}>Ops! Página não encontrada</h1>
      <p className={styles.errorMessage}>Parece que essa página não existe.</p>
      <Link className={styles.botaoInicio} href="/">Voltar para o início</Link>
    </div>
  );
}
