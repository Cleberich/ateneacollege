import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Obtener el rol desde Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setError(
          "No se encontraron datos del usuario. Contacta al administrador."
        );
        setLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      const userRole = userData.role;

      // 3. Redirigir según rol
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("El correo no es válido.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Correo o contraseña incorrectos.");
          break;
        default:
          setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <mai className="grid grid-cols-2">
      <div className="relative bg-[url('/img/banner.jpg')] bg-cover bg-no-repeat bg-center h-screen">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#673b76] px-4">
        <div>
          {" "}
          <img src="/img/atenealogo.png" className="w-40 mb-20" />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Iniciar Sesión
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atenea focus:outline-none"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atenea focus:outline-none"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-atenea hover:bg-atenea disabled:bg-atenea text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-atenea hover:underline font-medium"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </mai>
  );
}
