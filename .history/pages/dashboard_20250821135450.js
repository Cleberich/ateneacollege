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
  const [reviews, setReviews] = useState([]); // Todas las reseñas
  const [selectedCourseReviews, setSelectedCourseReviews] = useState(null); // Para el modal
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
                  grade: courseRating,
                };
              }
              return null;
            })
          );

          setEnrolledCourses(courses.filter(Boolean));
        }

        // Cargar cursos del profesor
        if (data.role === "teacher") {
          // Cargar inscripciones
          const enrollmentsSnapshot = await getDocs(
            collection(db, "enrollments")
          );
          const allEnrollments = enrollmentsSnapshot.docs.map((doc) => ({
            courseId: doc.data().courseId,
          }));
          setEnrollments(allEnrollments);

          // Cargar reseñas
          const reviewsSnapshot = await getDocs(collection(db, "reviews"));
          const allReviews = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            courseId: doc.data().courseId,
            userId: doc.data().userId,
            userName: doc.data().userName,
            rating: doc.data().rating,
            comment: doc.data().comment || "",
            timestamp:
              doc.data().timestamp?.toDate().toLocaleDateString() || "N/A",
          }));
          setReviews(allReviews);

          // Cargar usuarios
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
            const courseId = doc.id;
            const courseData = doc.data();

            // Estudiantes inscritos
            const studentCount = allEnrollments.filter(
              (e) => e.courseId === courseId
            ).length;

            // Reseñas de este curso
            const courseReviews = allReviews.filter(
              (r) => r.courseId === courseId
            );

            // Promedio de estrellas
            const averageRating =
              courseReviews.length > 0
                ? (
                    courseReviews.reduce((sum, r) => sum + r.rating, 0) /
                    courseReviews.length
                  ).toFixed(1)
                : "Sin";

            return {
              id: courseId,
              ...courseData,
              studentCount,
              averageRating,
              reviewCount: courseReviews.length,
              reviews: courseReviews, // Guardamos las reseñas aquí
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

  // --- Modal: abrir reseñas ---
  const openReviewsModal = (course) => {
    setSelectedCourseReviews(course);
  };

  // --- Modal: cerrar ---
  const closeReviewsModal = () => {
    setSelectedCourseReviews(null);
  };

  if (loading || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-atenea cursor-pointer py-2 border-t-transparent rounded-full animate-spin mb-3"></div>
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
                    className="border rounded-lg overflow-hidden hover:shadow-md transition flex flex-col"
                    onClick={() => router.push(`/courses/${course.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Imagen del curso */}
                    <div className="h-36 bg-gray-200 relative">
                      <img
                        src={course.imageUrl || "/img/banner.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/img/banner.jpg";
                        }}
                      />
                      <div className="px-4 mt-1">
                        {course.grade !== null ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-700 font-medium">
                              Calif:
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating = parseFloat(course.grade);
                                const isFull = star <= rating;
                                const isHalf =
                                  star - 0.5 <= rating && star > rating;
                                const isEmpty = star > rating + 0.5;

                                return (
                                  <span
                                    key={star}
                                    className="text-yellow-500 text-sm"
                                  >
                                    {isFull ? "★" : isHalf ? "☆" : "☆"}
                                  </span>
                                );
                              })}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              ({course.grade})
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <span>🌟</span> Sin calificación aún
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 mt-4 flex-1">
                      <h4 className="font-bold text-gray-800">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/courses/${course.id}`);
                        }}
                        className="mt-3 w-full text-center text-sm bg-atenea cursor-pointer py-2 hover:bg-blue-700 text-white py-1 rounded"
                      >
                        Entrar al Curso
                      </button>
                    </div>
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
                    className="border rounded-lg p-4 hover:shadow-md transition bg-purple-50"
                  >
                    <div className="flex justify-between">
                      {" "}
                      <h4
                        className="font-bold  text-gray-800 cursor-pointer hover:text-indigo-600"
                        onClick={() =>
                          router.push(`/teacher/course/${course.id}`)
                        }
                      >
                        {course.title}
                      </h4>
                      <button
                        className="cursor-pointer hover:text-indigo-600"
                        onClick={() =>
                          router.push(`/teacher/course/${course.id}`)
                        }
                      >
                        ✏️ Editar
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.lessons?.length || 0} lecciones
                    </p>
                    <p className="text-sm text-atenea cursor-pointer py-2 font-medium mt-1">
                      {course.studentCount}{" "}
                      {course.studentCount === 1 ? "estudiante" : "estudiantes"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500 text-sm">
                        {"⭐".repeat(Math.floor(course.averageRating))}
                        {"☆".repeat(5 - Math.floor(course.averageRating))}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        {course.averageRating !== "Sin"
                          ? course.averageRating
                          : "Sin"}{" "}
                        ({course.reviewCount})
                      </span>
                    </div>

                    <button
                      onClick={() => openReviewsModal(course)}
                      className="text-xs mt-2 text-indigo-600 hover:underline block"
                    >
                      Ver reseñas ({course.reviewCount})
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No has creado ningún curso.</p>
            )}
          </section>
        )}
      </main>

      {/* ✅ Modal de Reseñas */}
      {selectedCourseReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Encabezado */}
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Reseñas - {selectedCourseReviews.title}
              </h3>
              <button
                onClick={closeReviewsModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Cuerpo */}
            <div className="p-5 overflow-y-auto flex-1">
              {selectedCourseReviews.reviews.length > 0 ? (
                <ul className="space-y-4">
                  {selectedCourseReviews.reviews.map((review, idx) => (
                    <li key={idx} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between">
                        <strong className="text-gray-800">
                          {review.userName}
                        </strong>
                        <span className="text-yellow-500">
                          {"⭐".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {review.timestamp}
                      </p>
                      {review.comment && (
                        <p className="text-gray-700 mt-2 italic">
                          "{review.comment}"
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay reseñas aún.
                </p>
              )}
            </div>

            {/* Pie */}
            <div className="p-5 border-t text-right">
              <button
                onClick={closeReviewsModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
