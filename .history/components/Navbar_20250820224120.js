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

  return (
    <nav className="bg-[#51016d] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-0 flex justify-between items-center">
        <img
          src="/img/atenealogo.png"
          className="w-20 font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        <div className="flex items-center gap-4">
          <span className="text-sm text-white">
            Hola, <strong>{userData?.name || userData?.displayName}</strong>
          </span>
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
