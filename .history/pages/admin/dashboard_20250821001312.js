import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Navbar from "../../components/Navbar"; // Asegúrate de que la ruta sea correcta

export default function AdminDashboard() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]); // ← Lista de todas las inscripciones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Para asignar curso
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Para editar curso
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos
  useEffect(() => {
    const load = async () => {
      if (loadingAuth) return;

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Verificar que el usuario sea admin
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "admin") {
          setError("Acceso denegado: no eres administrador.");
          router.push("/dashboard");
          return;
        }

        setAdmin(userDoc.data());

        // Cargar todos los usuarios
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.role === "student" || u.role === "teacher");
        setUsers(usersList);

        // Cargar todos los cursos
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);

        // Cargar todas las inscripciones
        const enrollmentsSnapshot = await getDocs(
          collection(db, "enrollments")
        );
        const enrollmentsList = enrollmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          courseId: doc.data().courseId,
          progress: doc.data().progress || [],
          enrolledAt: doc.data().enrolledAt,
        }));
        setEnrollments(enrollmentsList);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    console.log(user);
    load();
  }, [user, loadingAuth, router]);

  // --- Contar estudiantes por curso ---
  const getStudentCount = (courseId) => {
    return enrollments.filter((e) => e.courseId === courseId).length;
  };

  // --- Iniciar edición de curso ---
  const startEditingCourse = (course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description || "");
  };

  // --- Guardar edición ---
  const saveCourseEdit = async () => {
    if (!editTitle.trim()) {
      alert("El título no puede estar vacío");
      return;
    }

    try {
      const courseDocRef = doc(db, "courses", editingCourse.id);
      await updateDoc(courseDocRef, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      // Actualizar estado local
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: editTitle.trim(),
                description: editDescription.trim(),
              }
            : c
        )
      );

      setEditingCourse(null);
      setEditTitle("");
      setEditDescription("");
    } catch (err) {
      console.error("Error al actualizar curso:", err);
      alert("No se pudo actualizar el curso.");
    }
  };

  // --- Cancelar edición ---
  const cancelEdit = () => {
    setEditingCourse(null);
    setEditTitle("");
    setEditDescription("");
  };

  // --- Asignar curso a estudiante ---
  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) return;

    setAssigning(true);
    setError("");

    try {
      // Verificar si ya está inscrito
      const alreadyEnrolled = enrollments.some(
        (e) => e.userId === selectedUserId && e.courseId === selectedCourseId
      );

      if (alreadyEnrolled) {
        setError("El estudiante ya está inscrito en este curso.");
        setAssigning(false);
        return;
      }

      // Crear inscripción
      await addDoc(collection(db, "enrollments"), {
        userId: selectedUserId,
        courseId: selectedCourseId,
        enrolledAt: new Date(),
        progress: [],
      });

      // Actualizar estado local
      setEnrollments([
        ...enrollments,
        {
          userId: selectedUserId,
          courseId: selectedCourseId,
          progress: [],
        },
      ]);

      alert("Curso asignado con éxito.");
      setSelectedUserId("");
      setSelectedCourseId("");
    } catch (err) {
      console.error("Error al asignar curso:", err);
      setError("No se pudo asignar el curso.");
    } finally {
      setAssigning(false);
    }
  };

  // Filtrar cursos
  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.teacherName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} userData={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Panel de Administrador
          </h1>
          <p className="text-gray-600 mb-8">
            Hola, {admin?.name || "Admin"} 👋
          </p>

          {/* Buscador de cursos */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Buscar y Editar Cursos
            </h2>
            <input
              type="text"
              placeholder="Buscar curso por título o profesor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          </div>
          <main>
            {/* Tabla de cursos */}
            <div className="bg-white p-6 rounded-lg shadow mb-8 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Todos los Cursos</h2>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Título</th>
                    <th className="text-left py-2">Profesor</th>
                    <th className="text-left py-2">Estudiantes</th>
                    <th className="text-left py-2">Lecciones</th>
                    <th className="text-left py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((c) => (
                      <tr key={c.id} className="border-b">
                        <td className="py-3">
                          {editingCourse?.id === c.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full p-1 border rounded"
                            />
                          ) : (
                            <span className="font-medium">{c.title}</span>
                          )}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {c.teacherName || "Desconocido"}
                        </td>
                        <td className="py-3">{getStudentCount(c.id)}</td>
                        <td className="py-3">{c.lessons?.length || 0}</td>
                        <td className="py-3">
                          {editingCourse?.id === c.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={saveCourseEdit}
                                className="text-green-600 hover:underline text-sm"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:underline text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingCourse(c)}
                              className="text-indigo-600 hover:underline text-sm"
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        No se encontraron cursos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Formulario: Asignar curso */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Asignar Curso a Estudiante
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleAssignCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estudiante
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar estudiante</option>
                    {users
                      .filter((u) => u.role === "student")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar curso</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={assigning}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg"
                >
                  {assigning ? "Asignando..." : "Asignar Curso"}
                </button>
              </form>
            </div>

            {/* Lista de Estudiantes */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">Estudiantes</h2>
              {users.filter((u) => u.role === "student").length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Nombre</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Cursos Asignados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => u.role === "student")
                        .map((u) => (
                          <StudentRow
                            key={u.id}
                            user={u}
                            courses={courses}
                            enrollments={enrollments}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No hay estudiantes registrados.</p>
              )}
            </div>

            {/* Lista de Profesores */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Profesores</h2>
              {users.filter((u) => u.role === "teacher").length > 0 ? (
                <ul className="space-y-2">
                  {users
                    .filter((u) => u.role === "teacher")
                    .map((u) => (
                      <li
                        key={u.id}
                        className="p-3 border border-gray-200 rounded"
                      >
                        <strong>{u.name}</strong> ({u.email})
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No hay profesores registrados.</p>
              )}
            </div>
          </main>
        </div>
      </div>{" "}
    </>
  );
}

// Componente para mostrar cursos asignados
function StudentRow({ user, courses, enrollments }) {
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    const userEnrollments = enrollments.filter((e) => e.userId === user.id);
    const coursesData = userEnrollments.map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      return {
        title: course?.title || "Curso eliminado",
        progress: e.progress?.length || 0,
        total: course?.lessons?.length || 0,
      };
    });
    setAssignedCourses(coursesData);
  }, [user.id, courses, enrollments]);

  return (
    <tr>
      <td className="py-3">{user.name}</td>
      <td className="py-3 text-sm text-gray-600">{user.email}</td>
      <td className="py-3">
        {assignedCourses.length > 0 ? (
          <ul className="space-y-1">
            {assignedCourses.map((c, idx) => (
              <li key={idx} className="text-sm">
                {c.title} — {c.progress}/{c.total} lecciones
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500">Ninguno</span>
        )}
      </td>
    </tr>
  );
}
