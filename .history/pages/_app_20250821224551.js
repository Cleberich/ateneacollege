// components/Layout.js o pages/_app.js
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Solo ejecuta en el cliente
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

  // Mientras carga, puedes mostrar un loader o renderizar sin user
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Cargando autenticación...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} userData={userData} />
      <main>{children}</main>
    </>
  );
}
