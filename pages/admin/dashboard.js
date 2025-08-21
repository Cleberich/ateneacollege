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
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Para asignar curso a estudiante
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Para asignar profesor a curso
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedCourseForTeacher, setSelectedCourseForTeacher] = useState("");

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

  // --- Asignar profesor a curso ---
  const handleAssignTeacherToCourse = async (e) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedCourseForTeacher) return;

    setError("");

    try {
      const courseRef = doc(db, "courses", selectedCourseForTeacher);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        setError("El curso no existe.");
        return;
      }

      const teacher = users.find((u) => u.id === selectedTeacherId);
      if (!teacher) {
        setError("Profesor no encontrado.");
        return;
      }

      // Actualizar curso con teacherId y teacherName
      await updateDoc(courseRef, {
        teacherId: selectedTeacherId,
        teacherName: teacher.name,
      });

      // Actualizar estado local
      setCourses(
        courses.map((c) =>
          c.id === selectedCourseForTeacher
            ? {
                ...c,
                teacherId: selectedTeacherId,
                teacherName: teacher.name,
              }
            : c
        )
      );

      alert("Profesor asignado al curso con éxito.");
      setSelectedTeacherId("");
      setSelectedCourseForTeacher("");
    } catch (err) {
      console.error("Error al asignar profesor:", err);
      setError("No se pudo asignar el profesor al curso.");
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
        <div className="mx-32 py-10 px-4">
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

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabla de cursos */}
            <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-[70vh]">
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
                        <td className="py-3">
                          {c.teacherId ? (
                            <div className="flex items-center gap-2">
                              {/* Foto del profesor */}
                              {(() => {
                                const teacher = users.find(
                                  (u) => u.id === c.teacherId
                                );
                                if (!teacher) return null;

                                return teacher.photoURL ? (
                                  <img
                                    src={teacher.photoURL}
                                    alt={teacher.name}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600 text-xs font-medium">
                                      {teacher.name?.charAt(0).toUpperCase() ||
                                        "?"}
                                    </span>
                                  </div>
                                );
                              })()}

                              {/* Nombre y ID del profesor */}
                              <div className="text-sm">
                                <p className="font-medium text-gray-800">
                                  {c.teacherName}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Sin asignar
                            </span>
                          )}
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

            {/* Formulario: Asignar curso a estudiante */}
            <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-[70vh]">
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

            {/* Lista de Estudiantes con fotos */}
            <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-[70vh]">
              <h2 className="text-xl font-semibold mb-4">Estudiantes</h2>
              {users.filter((u) => u.role === "student").length > 0 ? (
                <div className="space-y-3">
                  {users
                    .filter((u) => u.role === "student")
                    .map((u) => (
                      <StudentRowWithPhoto
                        key={u.id}
                        user={u}
                        courses={courses}
                        enrollments={enrollments}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay estudiantes registrados.</p>
              )}
            </div>

            {/* Formulario: Asignar Profesor a Curso */}
            <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-[70vh]">
              <h2 className="text-xl font-semibold mb-4">
                Asignar Profesor a Curso
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleAssignTeacherToCourse}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profesor
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar profesor</option>
                    {users
                      .filter((u) => u.role === "teacher")
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
                    value={selectedCourseForTeacher}
                    onChange={(e) =>
                      setSelectedCourseForTeacher(e.target.value)
                    }
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
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                >
                  Asignar Profesor
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// Componente: Estudiante con foto y cursos asignados
function StudentRowWithPhoto({ user, courses, enrollments }) {
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
    <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white">
      {/* Foto de perfil */}
      <div className="flex-shrink-0">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium text-sm">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>

        {/* Cursos asignados */}
        <div className="mt-2">
          {assignedCourses.length > 0 ? (
            <ul className="text-xs text-gray-600 space-y-1">
              {assignedCourses.map((c, idx) => (
                <li key={idx}>
                  {c.title} — {c.progress}/{c.total} lecciones
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-gray-400">Ningún curso asignado</span>
          )}
        </div>
      </div>
    </div>
  );
}
