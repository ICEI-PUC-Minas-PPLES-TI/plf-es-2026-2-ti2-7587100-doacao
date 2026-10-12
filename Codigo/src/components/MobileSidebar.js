import Link from "next/link";
import { useRouter } from "next/router";

const itens = [
  { href: "/", texto: "Início", icone: "⌂" },
  { href: "/doar", texto: "Doar", icone: "♢" },
  { href: "/locais", texto: "Locais", icone: "⌖" },
  { href: "/comunidade", texto: "Comunidade", icone: "♧" },
  { href: "/perfil", texto: "Perfil", icone: "◎" }
];

export default function MobileSidebar() {
  const router = useRouter();

  return (
    <nav className="mobile-sidebar" aria-label="Navegação principal">
      <div className="mobile-sidebar__container">
        {itens.map((item) => {
          const ativo = item.href === "/"
            ? router.pathname === "/"
            : router.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={ativo ? "mobile-sidebar__item mobile-sidebar__item--active" : "mobile-sidebar__item"}
            >
              <span className="mobile-sidebar__icon" aria-hidden="true">{item.icone}</span>
              <span>{item.texto}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
