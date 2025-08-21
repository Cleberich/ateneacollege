// pages/forum.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function ForumPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

  const router = useRouter();

  // Cargar datos del usuario
  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          router.push("/register");
          return;
        }
        setUserData(userDoc.data());
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setError("No se pudo cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, loadingAuth, router]);

  // Escuchar publicaciones en tiempo real
  useEffect(() => {
    const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    });

    return () => unsubscribe();
  }, []);

  // Escuchar comentarios
  useEffect(() => {
    const unsubscribeAll = posts.map((post) => {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", post.id),
        orderBy("createdAt", "asc")
      );
      return onSnapshot(q, (snapshot) => {
        const commentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments((prev) => ({ ...prev, [post.id]: commentList }));
      });
    });

    return () => unsubscribeAll.forEach((unsub) => unsub && unsub());
  }, [posts]);

  // Crear publicación
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const userPhotoURL = userData?.photoURL || user?.photoURL || null;

      await addDoc(collection(db, "forums"), {
        content: newPost.trim(),
        imageUrl: image || null,
        userId: user.uid,
        userName: userData?.name || "Usuario",
        userPhoto: userPhotoURL,
        userRole: userData?.role || "student",
        likes: [],
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });

      setNewPost("");
      setImage("");
    } catch (err) {
      setError("No se pudo crear la publicación.");
      console.error(err);
    }
  };

  // Dar like
  const handleLike = async (post) => {
    if (!user) return;

    const postRef = doc(db, "forums", post.id);
    const hasLiked = post.likes.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likes: hasLiked
          ? post.likes.filter((id) => id !== user.uid)
          : [...post.likes, user.uid],
      });
    } catch (err) {
      console.error("Error al dar like:", err);
      setError("No se pudo actualizar el like.");
    }
  };

  // Agregar comentario
  const handleAddComment = async (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      const userPhotoURL = userData?.photoURL || user?.photoURL || null;

      await addDoc(collection(db, "comments"), {
        postId,
        userId: user.uid,
        userName: userData?.name || "Usuario",
        userPhoto: userPhotoURL,
        content,
        createdAt: serverTimestamp(),
      });

      setNewComment({ ...newComment, [postId]: "" });

      // Actualizar contador
      const postRef = doc(db, "forums", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        await updateDoc(postRef, {
          commentsCount: postDoc.data().commentsCount + 1,
        });
      }
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  // Eliminar publicación
  const handleDeletePost = async (postId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")
    )
      return;

    try {
      const postRef = doc(db, "forums", postId);
      await deleteDoc(postRef);

      // Eliminar comentarios asociados
      const commentsSnapshot = await getDocs(
        query(collection(db, "comments"), where("postId", "==", postId))
      );
      commentsSnapshot.forEach(async (commentDoc) => {
        await deleteDoc(doc(db, "comments", commentDoc.id));
      });

      // Actualizar estado local
      setPosts(posts.filter((p) => p.id !== postId));
      setComments((prev) => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
      setError("No se pudo eliminar la publicación.");
    }
  };

  // Eliminar comentario
  const handleDeleteComment = async (postId, commentId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este comentario?")
    )
      return;

    try {
      await deleteDoc(doc(db, "comments", commentId));

      // Actualizar estado local
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId),
      }));

      // Reducir contador
      const postRef = doc(db, "forums", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists() && postDoc.data().commentsCount > 0) {
        await updateDoc(postRef, {
          commentsCount: postDoc.data().commentsCount - 1,
        });
      }
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      setError("No se pudo eliminar el comentario.");
    }
  };

  // Formatear fecha
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "ahora";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "hace unos minutos";
    if (diffInHours < 24) return `hace ${Math.floor(diffInHours)}h`;
    return date.toLocaleDateString();
  };

  if (loading || loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando foro...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar user={user} userData={userData} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Foro Educativo
          </h1>
          <p className="text-gray-600 mb-6">
            Comparte ideas, dudas y conocimientos con la comunidad.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Crear publicación */}
          <form
            onSubmit={handleCreatePost}
            className="bg-white p-6 rounded-lg shadow mb-6"
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué estás pensando?"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none"
              rows="3"
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL de imagen (opcional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />
            {image && (
              <div className="mb-3">
                <img
                  src={image}
                  alt="Vista previa"
                  className="w-full max-h-60 object-cover rounded-lg"
                />
              </div>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Publicar
            </button>
          </form>

          {/* Lista de publicaciones */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay publicaciones aún. ¡Sé el primero en publicar!
              </p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow">
                  {/* Cabecera */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.userPhoto || "/img/user-placeholder.jpg"}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.target.src = "/img/user-placeholder.jpg";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {post.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(post.createdAt)} ·{" "}
                          <span
                            className={`${
                              post.userRole === "admin"
                                ? "text-purple-600 bg-purple-100"
                                : post.userRole === "teacher"
                                ? "text-indigo-600 bg-indigo-100"
                                : "text-green-600 bg-green-100"
                            } px-1.5 py-0.5 rounded text-xs font-medium`}
                          >
                            {post.userRole === "admin"
                              ? "Administrador"
                              : post.userRole === "teacher"
                              ? "Profesor"
                              : "Estudiante"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Botón de eliminar (solo si es el autor) */}
                    {post.userId === user.uid && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Eliminar publicación"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {/* Contenido */}
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Imagen */}
                  {post.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={post.imageUrl}
                        alt="Publicación"
                        className="w-full max-h-80 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/img/course-placeholder.jpg";
                        }}
                      />
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex items-center gap-6 text-sm border-t pt-3">
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-1 ${
                        post.likes.includes(user?.uid)
                          ? "text-red-600"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      ❤️ {post.likes.length > 0 ? post.likes.length : ""}
                    </button>
                    <button
                      onClick={() =>
                        setShowComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="text-gray-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      💬 {post.commentsCount > 0 ? post.commentsCount : ""}
                    </button>
                  </div>

                  {/* Comentarios */}
                  {showComments[post.id] && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium text-gray-800 mb-3">
                        Comentarios
                      </h4>

                      {comments[post.id]?.length > 0 ? (
                        <ul className="space-y-3 mb-4">
                          {comments[post.id].map((comment) => (
                            <li
                              key={comment.id}
                              className="flex gap-3 bg-gray-50 p-3 rounded-lg"
                            >
                              <img
                                src={
                                  comment.userPhoto ||
                                  "/img/user-placeholder.jpg"
                                }
                                alt={comment.userName}
                                className="w-8 h-8 rounded-full object-cover border"
                                onError={(e) => {
                                  e.target.src = "/img/user-placeholder.jpg";
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-800">
                                    {comment.userName}
                                  </p>
                                  {comment.userId === user.uid && (
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(post.id, comment.id)
                                      }
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="Eliminar comentario"
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {comment.content}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatTimeAgo(comment.createdAt)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm mb-4">
                          No hay comentarios aún.
                        </p>
                      )}

                      {/* Agregar comentario */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment[post.id] || ""}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              [post.id]: e.target.value,
                            })
                          }
                          placeholder="Escribe un comentario..."
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
