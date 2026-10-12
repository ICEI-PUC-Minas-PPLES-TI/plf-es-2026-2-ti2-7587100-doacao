import Link from "next/link";

export default function NavbarSuperior() {
  return (
    <nav className="navbar-superior">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" aria-label="Página inicial do DoAção">
          <img src="/logo.png" alt="DoAção" />
        </Link>

        <div className="navbar-actions">
          <button type="button" className="navbar-button">
            <span className="navbar-button-icon" aria-hidden="true">✦</span>
            <span>Tire dúvidas</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
