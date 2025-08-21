import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

export default function Navbar({ user, userData }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    router.push("/profile/edit");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-[#51016d] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Barra principal */}
        <div className="flex justify-between items-center h-16">
          {/* Logo - Izquierda */}
          <div
            className="w-20 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <img
              src="/img/atenealogo.png"
              alt="Logo Atenea"
              className="w-full"
            />
          </div>

          {/* Navegación central */}
          <div className="flex space-x-8">
            <button
              onClick={() => router.push("/dashboard")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                router.pathname === "/dashboard"
                  ? "text-white  bg-opacity-20"
                  : "text-gray-200 hover:text-white hover:bg-purple-900 "
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/forum")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                router.pathname === "/forum"
                  ? "text-white  bg-opacity-20"
                  : "text-gray-200 hover:text-white hover:bg-purple-900 "
              }`}
            >
              Foro
            </button>
          </div>

          {/* Perfil - Derecha */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition focus:outline-none"
              aria-expanded={dropdownOpen}
              aria-label="Menú de usuario"
            >
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
              <span className="text-sm font-medium">
                {userData?.name || userData?.displayName || "Usuario"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Menú desplegable */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="py-1 text-gray-700">
                  {/* Nombre y correo */}
                  <div className="px-4 py-3 border-b">
                    <p className="font-medium">
                      {userData?.name || userData?.displayName || "Usuario"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Opciones del menú */}
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={goToProfile}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Editar perfil
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
}
