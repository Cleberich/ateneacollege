"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);

  // Si aún carga la autenticación
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario o no es profesor
  if (!user) {
    router.push("/login");
    return null;
  }

  if (user && !user.displayName) {
    // Opcional: redirigir si falta perfil
    router.push("/register");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Referencia a la colección 'courses'
      const courseRef = doc(collection(db, "courses"));

      // Datos del curso
      await setDoc(courseRef, {
        id: courseRef.id,
        title: title.trim(),
        description: description.trim(),
        teacherId: user.uid,
        teacherName: user.displayName,
        createdAt: new Date(),
        lessons: [], // Inicialmente vacío
        studentsCount: 0,
        progress: {}, // Puede usarse para seguimiento global
      });

      setSuccess("Curso creado con éxito!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error al crear el curso:", err);
      setError("No se pudo crear el curso. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} userData={userData} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Volver
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Crear Nuevo Curso
          </h1>

          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Curso *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej: Introducción a JavaScript"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe brevemente el contenido del curso..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando curso...
                  </>
                ) : (
                  "Crear Curso"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
