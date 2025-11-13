import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../../../lib/firebase";

export default function CourseLessonsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Para agregar/editar lección
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [adding, setAdding] = useState(false);

  // Para campos dinámicos
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // Para quizzes
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 },
  ]);

  // Para editar descripción
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  // ✅ Nuevo: Para imagen de portada
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null); // Archivo seleccionado
  const [previewUrl, setPreviewUrl] = useState(""); // Vista previa

  // --- Estado para edición de lección ---
  const [editingLesson, setEditingLesson] = useState(null);

  // Nuevo: Estado para alumnos inscritos y calificaciones
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Validar URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Asegurar que `questions` siempre sea un array
  useEffect(() => {
    if (!Array.isArray(questions)) {
      setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
    }
  }, [questions]);

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

  // Cargar curso
  useEffect(() => {
    if (!user || !id) return;

    const loadCourse = async () => {
      try {
        const courseDocRef = doc(db, "courses", id);
        const courseDocSnap = await getDoc(courseDocRef);

        if (!courseDocSnap.exists()) {
          setError("Curso no encontrado.");
          return;
        }

        const data = courseDocSnap.data();
        if (data.teacherId !== user.uid) {
          setError("No tienes permiso para editar este curso.");
        } else {
          setCourse(data);
          setNewDescription(data.description || "");
          setPreviewUrl(data.imageUrl || ""); // ← Usamos imageUrl como vista previa
        }
      } catch (err) {
        setError("Error al cargar el curso.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [user, id]);

  // Nuevo: Cargar alumnos inscritos
  useEffect(() => {
    if (!user || !id || !course) return;

    const loadEnrolledStudents = async () => {
      setLoadingStudents(true);
      try {
        // Obtener inscripciones del curso
        const enrollmentsRef = collection(db, "enrollments");
        const q = query(enrollmentsRef, where("courseId", "==", id));
        const querySnapshot = await getDocs(q);

        const studentsList = [];
        const gradesMap = {};

        for (const docSnap of querySnapshot.docs) {
          const enrollment = docSnap.data();
          const userId = enrollment.userId; // <-- Cambiado de studentId a userId

          // Validar que userId exista y sea un string
          if (userId && typeof userId === "string" && userId.trim() !== "") {
            // Obtener datos del estudiante
            const userDocRef = doc(db, "users", userId); // <-- Cambiado de studentId a userId
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const studentToAdd = {
                id: userId, // <-- Cambiado de studentId a userId
                enrollmentId: docSnap.id, // <-- ID del documento de inscripción
                name: userData.name || userData.email || "Sin nombre",
                email: userData.email || "Sin email",
                grade: enrollment.grade || null,
              };
              studentsList.push(studentToAdd);
              // Inicializar mapa de calificaciones
              gradesMap[userId] = enrollment.grade || ""; // <-- Cambiado de studentId a userId
            } else {
              // Opcional: manejar el caso donde el usuario no existe
              console.warn(
                `Usuario con ID ${userId} no encontrado en la colección 'users'.`
              );
            }
          } else {
            console.warn(
              "userId inválido o vacío encontrado en una inscripción:",
              docSnap.id
            );
          }
        }

        setEnrolledStudents(studentsList);
        setGrades(gradesMap);
      } catch (err) {
        console.error("Error al cargar alumnos inscritos:", err);
        setError("No se pudieron cargar los alumnos inscritos.");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadEnrolledStudents();
  }, [user, id, course]);

  // Nuevo: Manejar cambio de calificación
  const handleGradeChange = (studentId, value) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
      setGrades((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  // Nuevo: Guardar calificación
  const saveGrade = async (studentId) => {
    const gradeValue = grades[studentId];
    if (gradeValue === "") return;

    const numericGrade = parseFloat(gradeValue);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 10) {
      alert("La calificación debe ser un número entre 0 y 10.");
      return;
    }

    try {
      // Buscar el documento de inscripción usando el ID del estudiante y del curso
      const enrollmentsRef = collection(db, "enrollments");
      const q = query(
        enrollmentsRef,
        where("userId", "==", studentId),
        where("courseId", "==", id)
      ); // <-- Cambiado de studentId a userId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const enrollmentDocRef = doc(db, "enrollments", docSnap.id);
        await updateDoc(enrollmentDocRef, { grade: numericGrade }); // <-- Actualizar el campo grade

        // Actualizar estado local
        setEnrolledStudents((prev) =>
          prev.map((s) =>
            s.id === studentId ? { ...s, grade: numericGrade } : s
          )
        );

        alert("Calificación guardada exitosamente.");
      } else {
        alert("No se encontró la inscripción para este alumno.");
      }
    } catch (err) {
      console.error("Error al guardar calificación:", err);
      alert("No se pudo guardar la calificación.");
    }
  };

  // --- Subir imagen a Storage ---
  const uploadCoverImage = async () => {
    if (!file) return null;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten imágenes (JPG, PNG, WEBP).");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB.");
      return null;
    }

    try {
      setUploading(true);

      // Ruta en Storage
      const imagePath = `courses/${id}/cover.jpg`;
      const imageRef = ref(storage, imagePath);

      // Si ya existe una imagen, eliminarla
      try {
        await deleteObject(imageRef);
      } catch (err) {
        // Puede que no exista, no es un error grave
      }

      // Subir nueva imagen
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);

      // Actualizar Firestore
      const courseDocRef = doc(db, "courses", id);
      await updateDoc(courseDocRef, {
        imageUrl: downloadUrl,
      });

      // Actualizar estado
      setCourse({ ...course, imageUrl: downloadUrl });
      setPreviewUrl(downloadUrl);
      setIsEditingCover(false);
      setFile(null);

      alert("Portada actualizada con éxito.");
      return downloadUrl;
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError("No se pudo subir la imagen.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- Manejar cambio de archivo ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Vista previa local
    }
  };

  // --- Cancelar edición de imagen ---
  const cancelImageEdit = () => {
    setIsEditingCover(false);
    setFile(null);
    setPreviewUrl(course.imageUrl || ""); // Restaurar
  };

  // --- Iniciar edición de una lección ---
  const startEditingLesson = (lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setType(lesson.type);

    // Resetear todos los campos
    setContent("");
    setVideoUrl("");
    setPdfUrl("");
    setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);

    if (lesson.type === "text") {
      setContent(lesson.content || "");
    } else if (lesson.type === "video") {
      setVideoUrl(lesson.content || "");
    } else if (lesson.type === "pdf") {
      setPdfUrl(lesson.content || "");
    } else if (lesson.type === "quiz") {
      const quizContent = Array.isArray(lesson.content) ? lesson.content : [];
      setQuestions(JSON.parse(JSON.stringify(quizContent)));
    }
  };

  // --- Cancelar edición ---
  const cancelEdit = () => {
    setEditingLesson(null);
    setTitle("");
    setContent("");
    setVideoUrl("");
    setPdfUrl("");
    setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
    setType("text");
  };

  // --- Agregar o actualizar lección ---
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setAdding(true);
    setError("");

    try {
      let lessonContent = "";

      if (type === "text") {
        if (!content.trim()) {
          setError("El contenido no puede estar vacío.");
          setAdding(false);
          return;
        }
        lessonContent = content.trim();
      } else if (type === "video") {
        if (!videoUrl.trim() || !isValidUrl(videoUrl)) {
          setError("Por favor ingresa una URL de video válida.");
          setAdding(false);
          return;
        }
        lessonContent = videoUrl.trim();
      } else if (type === "pdf") {
        if (!pdfUrl.trim() || !pdfUrl.toLowerCase().endsWith(".pdf")) {
          setError("Por favor ingresa una URL válida terminada en .pdf");
          setAdding(false);
          return;
        }
        lessonContent = pdfUrl.trim();
      } else if (type === "quiz") {
        if (!Array.isArray(questions) || questions.length === 0) {
          setError("Debes agregar al menos una pregunta.");
          setAdding(false);
          return;
        }
        const isValid = questions.every(
          (q) =>
            q.question?.trim() &&
            Array.isArray(q.options) &&
            q.options.every((opt) => opt?.trim()) &&
            q.correct >= 0 &&
            q.correct < 4
        );
        if (!isValid) {
          setError(
            "Completa todas las preguntas, opciones y selecciona la respuesta correcta."
          );
          setAdding(false);
          return;
        }
        lessonContent = questions;
      }

      const newLesson = {
        id: editingLesson ? editingLesson.id : `les_${Date.now()}`,
        title: title.trim(),
        type,
        content: lessonContent,
        order: editingLesson
          ? editingLesson.order
          : course.lessons?.length || 0,
        createdAt: editingLesson ? editingLesson.createdAt : new Date(),
      };

      const updatedLessons = editingLesson
        ? course.lessons.map((l) => (l.id === editingLesson.id ? newLesson : l))
        : [...(course.lessons || []), newLesson];

      const courseDocRef = doc(db, "courses", id);
      await updateDoc(courseDocRef, {
        lessons: updatedLessons,
      });

      setCourse({ ...course, lessons: updatedLessons });
      cancelEdit();
    } catch (err) {
      setError("No se pudo guardar la lección.");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // ✅ Editar descripción del curso
  const handleUpdateDescription = async () => {
    if (!newDescription.trim()) {
      alert("La descripción no puede estar vacía");
      return;
    }

    try {
      const courseDocRef = doc(db, "courses", id);
      await updateDoc(courseDocRef, {
        description: newDescription.trim(),
      });

      setCourse({ ...course, description: newDescription.trim() });
      setIsEditingDesc(false);
    } catch (err) {
      setError("No se pudo actualizar la descripción.");
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          ← Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 grid grid-cols-1 lg:grid-cols-2 gap-8  mx-32">
      {/* Columna izquierda: Información del curso */}
      <div className="bg-white p-6 rounded-lg shadow">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>

        {/* ✅ Editar imagen de portada */}
        <div className="mt-6">
          {!isEditingCover ? (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Portada del Curso
              </h3>
              {previewUrl ? (
                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden border">
                  <img
                    src={previewUrl}
                    alt="Portada del curso"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/img/course-placeholder.jpg";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-40 mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
              )}
              <button
                onClick={() => setIsEditingCover(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                ✏️ Cambiar portada
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Subir Imagen de Portada
              </h3>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
              />

              {previewUrl && (
                <div className="mt-3 mb-3">
                  <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={uploadCoverImage}
                  disabled={uploading || !file}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-1 rounded text-sm flex items-center gap-1"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subiendo...
                    </>
                  ) : (
                    "Guardar Imagen"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelImageEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editar descripción */}
        <div className="mt-6">
          {!isEditingDesc ? (
            <div>
              <p className="text-gray-600 whitespace-pre-line">
                {course.description}
              </p>
              <button
                onClick={() => setIsEditingDesc(true)}
                className="text-sm text-indigo-600 hover:underline mt-2"
              >
                ✏️ Editar descripción
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                placeholder="Escribe la descripción del curso..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateDescription}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setNewDescription(course.description);
                    setIsEditingDesc(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          {course.lessons?.length || 0} lecciones
        </p>
      </div>

      {/* Columna derecha: Formulario y lista */}
      <div className="space-y-8">
        {/* Formulario: Agregar o Editar */}
        <form
          onSubmit={handleAddLesson}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingLesson ? "Editar Lección" : "Agregar Nueva Lección"}
          </h2>

          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg  placeholder:text-black"
              placeholder="Ej: Introducción al Marketing"
            />
          </div>

          {/* Tipo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1  placeholder:text-black">
              Tipo de Contenido
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setVideoUrl("");
                setPdfUrl("");
                setContent("");
                if (e.target.value !== "quiz") {
                  setQuestions([
                    { question: "", options: ["", "", "", ""], correct: 0 },
                  ]);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder:text-black"
            >
              <option value="text">Texto</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="quiz">Cuestionario</option>
            </select>
          </div>

          {/* Contenido condicional */}
          {type === "text" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Contenido
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder:text-black"
                placeholder="Escribe el contenido de la lección..."
              />
            </div>
          )}

          {type === "video" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del Video
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg  placeholder:text-black"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Soporta YouTube, Vimeo u otros enlaces directos.
              </p>
            </div>
          )}

          {type === "pdf" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del PDF
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg  placeholder:text-black"
                placeholder="https://ejemplo.com/archivo.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usa enlaces públicos (Google Drive, Dropbox, etc. con acceso
                compartido).
              </p>
            </div>
          )}

          {type === "quiz" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preguntas del Quiz
              </label>

              {Array.isArray(questions) ? (
                questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Escribe la pregunta"
                        value={q.question || ""}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].question = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correct === oIndex}
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].correct = oIndex;
                              setQuestions(newQuestions);
                            }}
                            className="mr-2"
                          />
                          <input
                            type="text"
                            placeholder={`Opción ${oIndex + 1}`}
                            value={opt || ""}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].options[oIndex] =
                                e.target.value;
                              setQuestions(newQuestions);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-600">
                  Error: el contenido del quiz no es válido.
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  setQuestions([
                    ...questions,
                    { question: "", options: ["", "", "", ""], correct: 0 },
                  ])
                }
                className="text-sm text-blue-600 hover:underline mb-4"
              >
                + Agregar otra pregunta
              </button>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg flex items-center gap-2"
            >
              {adding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingLesson ? "Guardando..." : "Agregando..."}
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>

            {editingLesson && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Nueva sección: Alumnos inscritos y calificaciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Alumnos Inscritos</h2>
          {loadingStudents ? (
            <p>Cargando alumnos...</p>
          ) : enrolledStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calificación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={grades[student.id]}
                            onChange={(e) =>
                              handleGradeChange(student.id, e.target.value)
                            }
                            className="w-20 p-1 border border-gray-300 rounded text-center  placeholder:text-black"
                          />
                          <button
                            onClick={() => saveGrade(student.id)}
                            className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay alumnos inscritos en este curso aún.</p>
          )}
        </div>

        {/* Lista de lecciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lecciones del Curso</h2>
          {course.lessons && course.lessons.length > 0 ? (
            <ul className="space-y-3">
              {course.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <li
                    key={lesson.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {lesson.title}
                        </h3>

                        {lesson.type === "text" && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {lesson.content}
                          </p>
                        )}

                        {lesson.type === "video" && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              ▶️ Video
                            </span>
                            <a
                              href={lesson.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-indigo-600 hover:underline mt-1"
                            >
                              Ver video
                            </a>
                          </div>
                        )}

                        {lesson.type === "pdf" && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              📄 PDF
                            </span>
                            <a
                              href={lesson.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-red-600 hover:underline mt-1"
                            >
                              Abrir PDF
                            </a>
                          </div>
                        )}

                        {lesson.type === "quiz" && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              📝 Quiz
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {Array.isArray(lesson.content)
                                ? lesson.content.length
                                : 0}{" "}
                              preguntas
                            </p>
                          </div>
                        )}

                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                          {lesson.type === "text"
                            ? "Texto"
                            : lesson.type === "video"
                            ? "Video"
                            : lesson.type === "pdf"
                            ? "PDF"
                            : "Cuestionario"}
                        </span>
                      </div>

                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => startEditingLesson(lesson)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aún no hay lecciones en este curso.</p>
          )}
        </div>
      </div>
    </div>
  );
}
