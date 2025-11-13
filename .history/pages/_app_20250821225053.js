// pages/_app.js
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/globals.css";

// No uses Layout aquí aún, lo hacemos todo en _app
export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Solo se ejecuta en el cliente
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          setUserData(userDocSnap.exists() ? userDocSnap.data() : null);
        } catch (err) {
          console.error("Error al cargar datos del usuario:", err);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Mientras carga la autenticación
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Cargando autenticación...</p>
      </div>
    );
  }

  // Renderiza el componente con el Navbar
  return (
    <>
      <Navbar user={user} userData={userData} />
      <Component {...pageProps} />
    </>
  );
}
