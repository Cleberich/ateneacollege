// pages/_app.js
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/router";

// Importa el Navbar solo si no estás en páginas públicas
import Navbar from "../components/Navbar";

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  // Lista de rutas donde NO se muestra el Navbar
  const hideNavbar = ["/", "/login", "/register", "/ong"];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          setUserData(userDocSnap.exists() ? userDocSnap.data() : null);
        } catch (err) {
          console.error("Error al cargar usuario:", err);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Cargando autenticación...</p>
      </div>
    );
  }

  // Renderiza sin Navbar en páginas públicas
  const showNavbar = !hideNavbar.includes(router.pathname);

  return (
    <>
      {showNavbar && <Navbar user={user} userData={userData} />}
      <Component {...pageProps} />
    </>
  );
}
