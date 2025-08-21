"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      // Obtener rol y nombre del usuario desde Firestore
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Si es profesor, cargar sus cursos
            if (data.role === "teacher") {
              const teacherCourses = []; // Aquí cargarías los cursos del profesor
              // Ejemplo: query(where('teacherId', '==', user.uid))
              setCourses(teacherCourses);
            }

            // Si es estudiante, cargar sus inscripciones
            if (data.role === "student") {
              const studentEnrollments = []; // Aquí cargarías las inscripciones
              // Ejemplo: query(where('userId', '==', user.uid))
              setEnrollments(studentEnrollments);
            }
          } else {
            // Si no existe el doc, redirigir a registro completo
            router.push("/onboarding"); // Opcional: completar perfil
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        }
      };

      fetchUserData();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Academia Online</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Hola, <strong>{userData?.name || user.email}</strong>
            </span>
            <button
              onClick={() => auth.signOut().then(() => router.push("/login"))}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Bienvenido al Dashboard
        </h2>

        {userData?.role === "teacher" && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Panel del Profesor
            </h3>
            <p className="text-gray-600 mb-4">
              Puedes crear y gestionar tus cursos desde aquí.
            </p>
            <button
              onClick={() => router.push("/teacher")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
            >
              Ir al Panel de Profesor
            </button>
          </div>
        )}

        {userData?.role === "student" && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Tus Cursos
            </h3>
            {enrollments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Ejemplo de curso inscrito */}
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.courseId}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() =>
                      router.push(`/courses/${enrollment.courseId}`)
                    }
                  >
                    <h4 className="font-medium text-gray-800">
                      Curso de Ejemplo
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Progreso: {enrollment.progress?.length || 0}/10 lecciones
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Aún no estás inscrito en ningún curso.
              </p>
            )}
            <button
              onClick={() => router.push("/courses")}
              className="mt-4 text-blue-600 hover:underline text-sm font-medium"
            >
              Ver todos los cursos disponibles →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
