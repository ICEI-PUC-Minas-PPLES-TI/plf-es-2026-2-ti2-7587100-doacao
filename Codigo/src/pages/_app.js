import "../styles/globals.css";
import "../styles/MobileSidebar.css";
import "../styles/NavbarSuperior.css";

import MobileSidebar from "../components/MobileSidebar";
import NavbarSuperior from "../components/NavbarSuperior";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavbarSuperior />
      <main className="page-content">
        <Component {...pageProps} />
      </main>
      <MobileSidebar />
    </>
  );
}
