// components/AuthenticatedLayout.js
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

export default function AuthenticatedLayout({ children }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          setUserData(userDocSnap.exists() ? userDocSnap.data() : null);
        } catch (err) {
          console.error("Error al cargar usuario:", err);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  // No bloqueamos aquí, lo hace la página
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
