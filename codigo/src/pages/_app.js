import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@/styles/globals.css";

import MobileSidebar from "@/components/MobileSidebar";
import NavbarSuperior from "@/components/NavbarSuperior";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavbarSuperior />
      <MobileSidebar />

      <main className="pt-1 pb-5">
        <Component {...pageProps} />
      </main>
    </>
  );
}