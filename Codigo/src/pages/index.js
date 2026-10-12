import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/comunidade"); }, [router]);
  return <p className="loading-page">Abrindo a comunidade...</p>;
}
