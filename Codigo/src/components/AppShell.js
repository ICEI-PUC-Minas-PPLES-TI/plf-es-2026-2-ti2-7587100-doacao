import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/", label: "Início", icon: "⌂" },
  { href: "/doar", label: "Doar", icon: "◇" },
  { href: "/locais", label: "Locais", icon: "⌖" },
  { href: "/comunidade", label: "Comunidade", icon: "♟" },
  { href: "/perfil", label: "Perfil", icon: "♙" }
];

export default function AppShell({ children }) {
  const router = useRouter();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="DoAção"><span className="brand-drop">♥</span></Link>
        <button className="help-button" type="button"><span aria-hidden="true">▤</span> Tire dúvidas</button>
      </header>
      <main className="page-content">{children}</main>
      <nav className="bottom-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={router.pathname.startsWith(item.href) && item.href !== "/" || router.pathname === item.href ? "nav-item active" : "nav-item"}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
