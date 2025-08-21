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
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]); // ← Nueva: cargar reseñas
  const [grades, setGrades] = useState({});
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

                // Cargar calificación del curso
                let courseRating = null;
                const reviewsRef = collection(db, "reviews");
                const r = query(
                  reviewsRef,
                  where("courseId", "==", courseId),
                  where("userId", "==", user.uid)
                );
                const reviewSnap = await getDocs(r);
                if (!reviewSnap.empty) {
                  courseRating = reviewSnap.docs[0].data().rating;
                }

                return {
                  id: courseDoc.id,
                  ...courseData,
                  progress: enrollmentData.progress || [],
                  grade: courseRating, // ← nota del curso
                };
              }
              return null;
            })
          );

          setEnrolledCourses(courses.filter(Boolean));
        }

        // Cargar cursos del profesor
        if (data.role === "teacher") {
          // Cargar TODAS las inscripciones
          const enrollmentsSnapshot = await getDocs(
            collection(db, "enrollments")
          );
          const allEnrollments = enrollmentsSnapshot.docs.map((doc) => ({
            enrollmentId: doc.id,
            userId: doc.data().userId,
            courseId: doc.data().courseId,
            progress: doc.data().progress || [],
          }));
          setEnrollments(allEnrollments);

          // Cargar TODAS las reseñas
          const reviewsSnapshot = await getDocs(collection(db, "reviews"));
          const allReviews = reviewsSnapshot.docs.map((doc) => ({
            courseId: doc.data().courseId,
            userId: doc.data().userId,
            rating: doc.data().rating,
            comment: doc.data().comment,
            userName: doc.data().userName,
            timestamp: doc.data().timestamp,
          }));
          setReviews(allReviews);

          // Cargar usuarios (para nombres)
          const usersSnapshot = await getDocs(collection(db, "users"));
          const usersMap = {};
          usersSnapshot.docs.forEach((doc) => {
            usersMap[doc.id] = doc.data().name;
          });

          // Cargar cursos del profesor
          const coursesRef = collection(db, "courses");
          const q = query(coursesRef, where("teacherId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const courses = querySnapshot.docs.map((doc) => {
            const courseData = doc.data();
            const courseId = doc.id;

            // Estudiantes inscritos
            const courseEnrollments = allEnrollments.filter(
              (e) => e.courseId === courseId
            );
            const students = courseEnrollments.map((e) => ({
              userId: e.userId,
              name: usersMap[e.userId] || "Nombre no disponible",
              progressCount: e.progress.length,
              totalLessons: courseData.lessons?.length || 0,
            }));

            // Calificaciones del curso
            const courseReviews = allReviews.filter(
              (r) => r.courseId === courseId
            );
            const averageRating =
              courseReviews.length > 0
                ? (
                    courseReviews.reduce((sum, r) => sum + r.rating, 0) /
                    courseReviews.length
                  ).toFixed(1)
                : "Sin calificaciones";

            return {
              id: courseId,
              ...courseData,
              studentCount: students.length,
              students,
              averageRating, // ← Promedio
              reviews: courseReviews, // ← Reseñas completas
            };
          });

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

  const toggleGrades = (courseId) => {
    setGrades((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

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
      <Navbar user={user} userData={userData} />

      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Bienvenido, {userData?.name?.split(" ")[0]} 👋
        </h2>

        {/* Panel Estudiantes */}
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
                    {course.grade !== null && (
                      <p className="text-sm text-yellow-600 font-medium mt-1">
                        ⭐ {course.grade}/5
                      </p>
                    )}
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

        {/* Panel Profesores */}
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
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h4
                      className="font-medium text-gray-800 cursor-pointer hover:text-indigo-600"
                      onClick={() =>
                        router.push(`/teacher/course/${course.id}`)
                      }
                    >
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.lessons?.length || 0} lecciones
                    </p>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {course.studentCount}{" "}
                      {course.studentCount === 1 ? "estudiante" : "estudiantes"}
                    </p>
                    <p className="text-sm text-yellow-600 font-medium">
                      ⭐ {course.averageRating}
                    </p>

                    <button
                      onClick={() => toggleGrades(course.id)}
                      className="text-xs mt-2 text-indigo-600 hover:underline"
                    >
                      {grades[course.id] ? "Ocultar" : "Ver"} calificaciones
                    </button>

                    {grades[course.id] && (
                      <div className="mt-3 border-t pt-2 max-h-60 overflow-y-auto text-xs">
                        {course.reviews.length > 0 ? (
                          <ul className="space-y-2">
                            {course.reviews.map((review, idx) => (
                              <li key={idx} className="pt-1 border-t">
                                <strong>{review.userName}</strong>
                                <div className="flex">
                                  {"⭐".repeat(review.rating)}
                                  {"☆".repeat(5 - review.rating)}
                                </div>
                                {review.comment && (
                                  <p className="text-gray-600 italic mt-1">
                                    "{review.comment.substring(0, 80)}..."
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Sin reseñas aún</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No has creado ningún curso.</p>
            )}
          </section>
        )}

        {/* Perfil */}
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
