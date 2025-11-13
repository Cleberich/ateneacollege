import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function StudentCoursePage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [progress, setProgress] = useState([]);
  const [enrollmentId, setEnrollmentId] = useState("");

  // Para calificación del curso
  const [courseRating, setCourseRating] = useState(0);
  const [courseHover, setCourseHover] = useState(0);
  const [courseReviewText, setCourseReviewText] = useState("");
  const [submittedCourseReview, setSubmittedCourseReview] = useState(false);

  // Para quizzes
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  // --- NUEVO: Para calificar lecciones ---
  const [lessonRatings, setLessonRatings] = useState({});
  const [lessonReviews, setLessonReviews] = useState({});
  const [lessonHover, setLessonHover] = useState({});

  // --- Ver lección actual ---
  const [selectedLesson, setSelectedLesson] = useState(null);

  // --- Estado: índice actual ---
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // --- NUEVO: Para la calificación del profesor ---
  const [teacherGrade, setTeacherGrade] = useState(null);

  // --- NUEVO: Para videoconferencia ---
  const [jitsiApi, setJitsiApi] = useState(null);
  const jitsiContainerRef = useRef(null);

  // Escuchar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Cargar curso, progreso y calificación del profesor
  useEffect(() => {
    const loadCourseAndProgress = async () => {
      if (!id || !user) return;

      setLoading(true);
      try {
        // 1. Cargar curso
        const courseDocRef = doc(db, "courses", id);
        const courseDocSnap = await getDoc(courseDocRef);

        if (!courseDocSnap.exists()) {
          setError("Curso no encontrado.");
          setLoading(false);
          return;
        }

        const courseData = courseDocSnap.data();
        setCourse(courseData);

        // 2. Cargar progreso
        const enrollmentsRef = collection(db, "enrollments");
        const q = query(
          enrollmentsRef,
          where("userId", "==", user.uid),
          where("courseId", "==", id)
        );
        const querySnapshot = await getDocs(q);

        let enrollmentData = null;
        if (!querySnapshot.empty) {
          enrollmentData = querySnapshot.docs[0].data();
          setProgress(enrollmentData.progress || []);
          setEnrollmentId(querySnapshot.docs[0].id);

          // 2.1. Cargar la calificación del profesor desde la inscripción
          setTeacherGrade(enrollmentData.grade || null);
        }

        // 3. Cargar calificación del curso
        const reviewsRef = collection(db, "reviews");
        const r = query(
          reviewsRef,
          where("courseId", "==", id),
          where("userId", "==", user.uid)
        );
        const reviewSnap = await getDocs(r);
        if (!reviewSnap.empty) {
          const review = reviewSnap.docs[0].data();
          setCourseRating(review.rating);
          setCourseReviewText(review.comment);
          setSubmittedCourseReview(true);
        }

        // 4. Cargar respuestas de quizzes
        const quizAnswersRef = collection(db, "quiz_answers");
        const q2 = query(
          quizAnswersRef,
          where("courseId", "==", id),
          where("userId", "==", user.uid)
        );
        const answersSnap = await getDocs(q2);
        const responsesTemp = {};
        const resultsTemp = {};
        const quizSubmittedTemp = {};

        answersSnap.forEach((doc) => {
          const data = doc.data();
          responsesTemp[data.lessonId] = data.answers;
          resultsTemp[data.lessonId] = data.correct;
          quizSubmittedTemp[data.lessonId] = true;
        });

        setResponses(responsesTemp);
        setResults(resultsTemp);
        setQuizSubmitted(quizSubmittedTemp);

        // 5. Cargar calificaciones de lecciones
        const lessonReviewsRef = collection(db, "lesson_reviews");
        const lrQuery = query(
          lessonReviewsRef,
          where("courseId", "==", id),
          where("userId", "==", user.uid)
        );
        const lrSnap = await getDocs(lrQuery);
        const ratings = {};
        const reviews = {};
        lrSnap.forEach((doc) => {
          const data = doc.data();
          ratings[data.lessonId] = data.rating;
          reviews[data.lessonId] = data.comment;
        });
        setLessonRatings(ratings);
        setLessonReviews(reviews);

        // 6. Si hay progreso, ir a la siguiente pendiente
        let nextIndex = 0;
        if (courseData.lessons) {
          nextIndex = courseData.lessons.findIndex(
            (l) => !progress.includes(l.id)
          );
          if (nextIndex === -1) nextIndex = courseData.lessons.length - 1;
        }
        setCurrentLessonIndex(Math.max(0, nextIndex));

        // Abrir primera lección si hay
        if (courseData.lessons?.length > 0) {
          setSelectedLesson(courseData.lessons[nextIndex]);
        }
      } catch (err) {
        console.error("Error al cargar el curso:", err);
        setError("No se pudo cargar el curso.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndProgress();
  }, [id, user]);

  // --- NUEVO: Cargar Jitsi API cuando se selecciona una clase en vivo ---
  useEffect(() => {
    if (selectedLesson?.type === "live" && jitsiContainerRef.current) {
      const loadJitsi = async () => {
        // 1. Cargar el script de Jitsi si no está ya disponible
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement("script");
          script.src = "https://meet.jit.si/external_api.js";
          script.async = true;
          script.onload = () => {
            console.log("Jitsi API cargada.");
          };
          document.head.appendChild(script);
        } else {
          console.log("Jitsi API ya está disponible.");
        }

        // 2. Esperar a que el script esté completamente cargado
        const waitForJitsi = () => {
          if (window.JitsiMeetExternalAPI) {
            // 3. Crear la instancia de Jitsi
            const domain = "meet.jit.si"; // Puedes cambiarlo por tu dominio Jitsi
            const options = {
              roomName: selectedLesson.content, // Asumiendo que content es el nombre de la sala
              width: "100%",
              height: 600, // Ajusta la altura según necesites
              parentNode: jitsiContainerRef.current,
              userInfo: {
                displayName: user?.displayName || user?.email || "Alumno",
                email: user?.email,
              },
              configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                disableModeratorIndicator: true,
                // Opciones para grabación (si está habilitada en el servidor Jitsi)
                // recording: {
                //   enabled: true // No se puede forzar la grabación aquí normalmente
                // }
              },
              interfaceConfigOverwrite: {
                filmStripOnly: false,
                HIDE_INVITE_MORE_HEADER: true,
              },
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);
            setJitsiApi(api);

            // Opcional: Escuchar eventos de Jitsi
            // api.addEventListeners({
            //   videoConferenceJoined: () => {
            //     console.log("Alumno unido a la conferencia");
            //   },
            //   videoConferenceLeft: () => {
            //     console.log("Alumno dejó la conferencia");
            //     // Aquí podrías marcar la lección como completada si es necesario
            //     // markAsCompletedAndNext(selectedLesson.id);
            //   }
            // });
          } else {
            setTimeout(waitForJitsi, 100);
          }
        };
        waitForJitsi();
      };

      loadJitsi();
    }

    // --- Limpiar Jitsi cuando cambia de lección o se desmonta el componente ---
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
        setJitsiApi(null);
      }
    };
  }, [selectedLesson, user]); // Agregamos 'user' para que displayName/email se actualicen si cambian

  // --- Calificar lección ---
  const submitLessonReview = async (lessonId) => {
    const rating = lessonRatings[lessonId];
    const comment = lessonReviews[lessonId] || "";

    if (!rating || rating === 0) {
      alert("Por favor califica la lección.");
      return;
    }

    try {
      await addDoc(collection(db, "lesson_reviews"), {
        lessonId,
        courseId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        rating,
        comment,
        timestamp: new Date(),
      });
      alert("¡Gracias por tu reseña!");
    } catch (err) {
      console.error("Error al guardar reseña de lección:", err);
      alert("No se pudo guardar la reseña.");
    }
  };

  // --- Marcar como completada y avanzar ---
  const markAsCompletedAndNext = async (lessonId) => {
    if (!lessonId || progress.includes(lessonId)) return;

    const newProgress = [...progress, lessonId];
    setProgress(newProgress);

    // Guardar en Firestore
    if (enrollmentId) {
      try {
        await updateDoc(doc(db, "enrollments", enrollmentId), {
          progress: newProgress,
        });
      } catch (err) {
        console.error("Error al guardar progreso:", err);
      }
    }

    // Guardar calificación
    if (lessonRatings[lessonId]) {
      try {
        await addDoc(collection(db, "lesson_reviews"), {
          lessonId,
          courseId: id,
          userId: user.uid,
          rating: lessonRatings[lessonId],
          comment: lessonReviews[lessonId] || "",
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Error al guardar reseña:", err);
      }
    }

    // Buscar siguiente
    const nextIndex = currentLessonIndex + 1;
    if (course.lessons && nextIndex < course.lessons.length) {
      setCurrentLessonIndex(nextIndex);
      setSelectedLesson(course.lessons[nextIndex]);
    } else {
      alert("🎉 ¡Curso completado!");
      setSelectedLesson(null);
    }
  };

  // --- Cambiar lección manualmente ---
  const goToLesson = (index) => {
    if (course.lessons && index >= 0 && index < course.lessons.length) {
      setCurrentLessonIndex(index);
      setSelectedLesson(course.lessons[index]);
    }
  };

  // --- Enviar calificación del curso ---
  const submitCourseReview = async () => {
    if (courseRating === 0) {
      alert("Por favor califica el curso.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        courseId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        rating: courseRating,
        comment: courseReviewText,
        timestamp: new Date(),
      });
      setSubmittedCourseReview(true);
      alert("¡Gracias por tu reseña del curso!");
    } catch (err) {
      console.error("Error al enviar reseña del curso:", err);
      alert("No se pudo enviar la reseña.");
    }
  };

  // --- Responder quiz ---
  const submitQuiz = async (lessonId, questions) => {
    const userAnswers = responses[lessonId] || {};
    const correctAnswers = questions.map(
      (q, i) => userAnswers[i] === q.correct
    );
    const score = correctAnswers.filter(Boolean).length;

    setResults((prev) => ({ ...prev, [lessonId]: correctAnswers }));
    setQuizSubmitted((prev) => ({ ...prev, [lessonId]: true }));

    try {
      await addDoc(collection(db, "quiz_answers"), {
        courseId: id,
        lessonId,
        userId: user.uid,
        userName: user.displayName || user.email,
        answers: userAnswers,
        correct: correctAnswers,
        score,
        total: questions.length,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error al guardar respuestas:", err);
    }
  };

  const handleAnswer = (lessonId, qIndex, answerIndex) => {
    setResponses((prev) => ({
      ...prev,
      [lessonId]: { ...prev[lessonId], [qIndex]: answerIndex },
    }));
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando curso...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error || "Curso no encontrado"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Volver al dashboard
        </button>
      </div>
    );
  }
  // Función para convertir cualquier URL de YouTube a embed
  const getEmbedUrl = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            Progreso: {progress.length} / {course.lessons?.length || 0}{" "}
            lecciones
          </p>
          {/* Nueva sección: Mostrar calificación del profesor si está completo y ya se calificaron todas las lecciones */}
          {progress.length === course.lessons?.length &&
            teacherGrade !== null && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  Calificación Final:
                </h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xl font-bold ${
                      teacherGrade >= 6 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {teacherGrade.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">/10</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({teacherGrade >= 6 ? "Aprobado" : "No Aprobado"})
                  </span>
                </div>
              </div>
            )}
          {progress.length === course.lessons?.length &&
            teacherGrade === null && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  📝 El profesor aún no ha asignado tu calificación final.
                  Revísala más tarde.
                </p>
              </div>
            )}
        </div>

        {/* Índice de lecciones */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-medium mb-2">Índice del curso</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {course.lessons?.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => goToLesson(idx)}
                className={`p-2 text-xs text-center rounded border ${
                  currentLessonIndex === idx
                    ? "bg-blue-100 border-blue-300"
                    : progress.includes(lesson.id)
                    ? "bg-green-100 border-green-300"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {idx + 1}. {lesson.title.substring(0, 20)}...
              </button>
            ))}
          </div>
        </div>

        {/* Vista de lección */}
        {selectedLesson && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedLesson.title}
            </h2>

            {/* Contenido */}
            {selectedLesson.type === "text" && (
              <p className="text-gray-700 leading-relaxed">
                {selectedLesson.content}
              </p>
            )}

            {selectedLesson.type === "video" && (
              <div>
                <iframe
                  className="w-full min-h-[600px] mt-2 rounded"
                  src={getEmbedUrl(selectedLesson.content)}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {selectedLesson.type === "pdf" && (
              <div>
                <p>📄 PDF</p>
                <iframe
                  className="w-full h-96 mt-2 rounded"
                  src={selectedLesson.content}
                  title="PDF"
                ></iframe>
              </div>
            )}

            {/* NUEVO: Tipo de lección en vivo */}
            {selectedLesson.type === "live" && (
              <div>
                <p>🎥 Conectado a la clase en vivo</p>
                <div
                  ref={jitsiContainerRef}
                  className="mt-2 rounded overflow-hidden"
                ></div>
                {/* Opcional: Mostrar grabación si está disponible */}
                {selectedLesson.recordingUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Revisión de Clase</h4>
                    <iframe
                      className="w-full h-96 mt-2 rounded"
                      src={selectedLesson.recordingUrl}
                      title="Grabación de la clase"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {selectedLesson.type === "quiz" &&
              !quizSubmitted[selectedLesson.id] && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-3">Responder Quiz</h4>
                  {selectedLesson.content.map((q, qIndex) => (
                    <div key={qIndex} className="mb-4">
                      <p>
                        <strong>{qIndex + 1}.</strong> {q.question}
                      </p>
                      <div className="ml-4 mt-2 space-y-1">
                        {q.options.map((opt, oIndex) => (
                          <label key={oIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`q-${selectedLesson.id}-${qIndex}`}
                              onChange={() =>
                                handleAnswer(selectedLesson.id, qIndex, oIndex)
                              }
                              className="mr-2"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      submitQuiz(selectedLesson.id, selectedLesson.content)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Enviar respuestas
                  </button>
                </div>
              )}

            {selectedLesson.type === "quiz" &&
              quizSubmitted[selectedLesson.id] && (
                <div className="mt-4 p-4 bg-green-100 rounded">
                  <h4>Quiz completado ✅</h4>
                  <ul>
                    {results[selectedLesson.id]?.map((isCorrect, idx) => (
                      <li
                        key={idx}
                        className={
                          isCorrect ? "text-green-800" : "text-red-800"
                        }
                      >
                        Pregunta {idx + 1}:{" "}
                        {isCorrect ? "✅ Correcta" : "❌ Incorrecta"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Calificación de la lección */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Califica esta lección</h4>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="text-2xl cursor-pointer"
                    onClick={() =>
                      setLessonRatings({
                        ...lessonRatings,
                        [selectedLesson.id]: star,
                      })
                    }
                    onMouseEnter={() =>
                      setLessonHover({
                        ...lessonHover,
                        [selectedLesson.id]: star,
                      })
                    }
                    onMouseLeave={() => setLessonHover({})}
                  >
                    {star <=
                    (lessonHover[selectedLesson.id] ||
                      lessonRatings[selectedLesson.id] ||
                      0)
                      ? "⭐"
                      : "☆"}
                  </span>
                ))}
              </div>
              <textarea
                value={lessonReviews[selectedLesson.id] || ""}
                onChange={(e) =>
                  setLessonReviews({
                    ...lessonReviews,
                    [selectedLesson.id]: e.target.value,
                  })
                }
                rows="2"
                className="w-full p-2 border border-gray-300 rounded mb-3"
                placeholder="¿Qué te pareció esta lección?"
              />
            </div>

            {/* Botón: Marcar y avanzar */}
            <div className="mt-6">
              <button
                onClick={() => markAsCompletedAndNext(selectedLesson.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
              >
                {currentLessonIndex + 1 < (course.lessons?.length || 0)
                  ? "✅ Marcar y siguiente"
                  : "✅ Finalizar curso"}
              </button>
            </div>
          </div>
        )}

        {/* Calificación del curso (solo si completó todo) */}
        {progress.length === course.lessons?.length &&
          !submittedCourseReview && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                ¡Curso completado! 🎉
              </h3>
              <p>Gracias por completar el curso. Ahora puedes calificarlo.</p>
              <div className="mt-4">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="text-2xl cursor-pointer"
                      onClick={() => setCourseRating(star)}
                      onMouseEnter={() => setCourseHover(star)}
                      onMouseLeave={() => setCourseHover(0)}
                    >
                      {star <= (courseHover || courseRating) ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
                <textarea
                  value={courseReviewText}
                  onChange={(e) => setCourseReviewText(e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 placeholder:text-black"
                  placeholder="Tu opinión ayuda a mejorar el curso..."
                />
                <button
                  onClick={submitCourseReview}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Enviar calificación
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
