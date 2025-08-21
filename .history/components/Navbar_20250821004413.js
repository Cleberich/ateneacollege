import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

export default function Navbar({ user, userData }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Función para ir al perfil
  const goToProfile = () => {
    router.push("/profile/edit");
  };

  return (
    <nav className="bg-[#51016d] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-0 flex justify-between items-center">
        {/* Logo */}
        <img
          src="/img/atenealogo.png"
          alt="Logo"
          className="w-20 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        {/* Sección derecha: Perfil y Salir */}
        <div className="flex items-center gap-4">
          {/* Nombre del usuario */}
          <span className="text-sm text-white">
            Hola,{" "}
            <strong>
              {userData?.name || userData?.displayName || "Usuario"}
            </strong>
          </span>

          {/* Botón de perfil */}
          <button
            onClick={goToProfile}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition"
            aria-label="Editar perfil"
          >
            {/* Imagen de perfil o ícono por defecto */}
            {userData?.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Foto de perfil"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </button>

          {/* Botón de salir */}
          <button
            onClick={handleSignOut}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
