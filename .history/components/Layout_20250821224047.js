// components/Layout.js
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (err) {
          console.error("Error al cargar datos del usuario:", err);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, [user]);

  // Mostrar carga solo si está autenticando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Cargando...</p>
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
