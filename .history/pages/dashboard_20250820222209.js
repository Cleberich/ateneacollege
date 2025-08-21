import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Navbar from "../components/Navbar"; // ← Importa el Navbar

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          router.push("/register");
          return;
        }

        const data = userDocSnap.data();
        setUserData(data);

        // Cargar cursos del estudiante
        if (data.role === "student") {
          const enrollmentsRef = collection(db, "enrollments");
          const q = query(enrollmentsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const courses = await Promise.all(
            querySnapshot.docs.map(async (enrollmentDoc) => {
              const courseId = enrollmentDoc.data().courseId;
              const courseDoc = await getDoc(doc(db, "courses", courseId));
              if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                const enrollmentData = enrollmentDoc.data();
                return {
                  id: courseDoc.id,
                  ...courseData,
                  progress: enrollmentData.progress || [],
                };
              }
              return null;
            })
          );

          setEnrolledCourses(courses.filter(Boolean));
        }

        // Cargar cursos del profesor
        if (data.role === "teacher") {
          const coursesRef = collection(db, "courses");
          const q = query(coursesRef, where("teacherId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const courses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCreatedCourses(courses);
        }
      } catch (err) {
        console.error("Error al cargar el dashboard:", err);
      } finally {
        setUserLoaded(true);
      }
    };

    fetchUserData();
  }, [user, loading, router]);

  if (loading || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar común */}
      <Navbar user={user} userData={userData} />

      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Bienvenido, {userData?.name?.split(" ")[0]} 👋
        </h2>

        {/* Panel para Estudiantes */}
        {userData?.role === "student" && (
          <section className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Tus Cursos
            </h3>
            {enrolledCourses.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h4 className="font-medium text-gray-800">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Progreso: {course.progress.length} /{" "}
                      {course.lessons?.length || 0}
                    </p>
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="mt-3 w-full text-center text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
                    >
                      Entrar al Curso
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No estás inscrito en ningún curso.
              </p>
            )}
          </section>
        )}

        {/* Panel para Profesores */}
        {userData?.role === "teacher" && (
          <section className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-800">Tus Cursos</h3>
              <button
                onClick={() => router.push("/teacher/create-course")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded"
              >
                + Nuevo Curso
              </button>
            </div>
            {createdCourses.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {createdCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => router.push(`/teacher/course/${course.id}`)}
                  >
                    <h4 className="font-medium text-gray-800">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.lessons?.length || 0} lecciones
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No has creado ningún curso.</p>
            )}
          </section>
        )}

        {/* Información del usuario */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Tu Perfil</h3>
          <p>
            <strong>Nombre:</strong> {userData?.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong>{" "}
            {userData?.role === "teacher" ? "Profesor" : "Estudiante"}
          </p>
        </div>
      </main>
    </div>
  );
}
