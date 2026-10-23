// Navbar retirada da "https://flowbite.com/docs/components/navbar/"
// Apenas customizei ela para aquilo que eu precisava

import styles from "@/styles/NavbarSuperior.module.css";
import AcessoUsuario from "@/modules/autenticacao/AcessoUsuario";

export default function NavbarSuperior() {
    return (
        <nav className={styles.navbarSuperior}>
            <div className={styles.navbarContainer}>
                <a href="/" className={styles.navbarLogo}><img src="/logo.png" alt="Logo" /></a>
                <div className={styles.navbarActions}>
                    <AcessoUsuario />
                    <a href="#" className={styles.navbarButton}><svg className={styles.navbarButtonIcon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c.45 3.05 1.35 5.25 2.75 6.65C16.15 10.05 17.95 10.85 21 12c-3.05 1.15-4.85 1.95-6.25 3.35C13.35 16.75 12.45 18.95 12 22c-.45-3.05-1.35-5.25-2.75-6.65C7.85 13.95 6.05 13.15 3 12c3.05-1.15 4.85-1.95 6.25-3.35C10.65 8.05 11.55 5.05 12 2Z" />
                            <path d="M19 2c.2 1.25.55 2.15 1.1 2.7.55.55 1.45.9 2.7 1.1-1.25.2-2.15.55-2.7 1.1-.55.55-.9 1.45-1.1 2.7-.2-1.25-.55-2.15-1.1-2.7-.55-.55-1.45-.9-2.7-1.1 1.25-.2 2.15-.55 2.7-1.1.55-.55.9-1.45 1.1-2.7Z" />
                        </svg>
                        <span>Tire dúvidas</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
