import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfile() {
  const [user, loadingAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulario
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // Foto de perfil
  const [photoURL, setPhotoURL] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setError("No se encontraron datos del usuario.");
          return;
        }

        const data = userDocSnap.data();
        setUserData(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(user.email || "");
        setPhotoURL(data.photoURL || "");
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, loadingAuth, router]);

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Subir foto a Firebase Storage
  const uploadPhoto = async () => {
    if (!file) return photoURL;

    setUploading(true);
    setError("");
    try {
      const storageRef = ref(storage, `profile-images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
      return downloadURL;
    } catch (err) {
      console.error("Error al subir foto:", err);
      setError(
        "No se pudo subir la foto: " + (err.message || "Error desconocido")
      );
      return photoURL;
    } finally {
      setUploading(false);
    }
  };

  // Reautenticar (obligatorio para cambiar email/contraseña)
  const reauthenticate = async () => {
    if (!currentPassword)
      throw new Error("Debes ingresar tu contraseña actual.");
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Reautenticar si se cambia email o contraseña
      if (email !== user.email || newPassword) {
        await reauthenticate();
      }

      // Subir foto si hay archivo nuevo
      const photoDownloadURL = await uploadPhoto();

      // Actualizar datos en Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name,
        phone,
        photoURL: photoDownloadURL,
      });

      // Cambiar email si es diferente
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Cambiar contraseña si se ingresó
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }
        if (newPassword.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        await updatePassword(user, newPassword);
      }

      setSuccess("Perfil actualizado con éxito.");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      if (err.message.includes("Contraseña actual incorrecta")) {
        setError("Contraseña actual incorrecta.");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "Por seguridad, debes volver a iniciar sesión para realizar este cambio."
        );
      } else if (err.code === "auth/email-already-in-use") {
        setError("Este email ya está en uso.");
      } else {
        setError(
          "Error: " + (err.message || "No se pudo actualizar el perfil.")
        );
      }
    }
  };

  if (loadingAuth || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="py-10 px-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          {/* Foto de perfil */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de perfil
            </label>

            {/* Vista previa de la foto actual o nueva */}
            {(photoURL || file) && (
              <div className="mb-2">
                <img
                  src={file ? URL.createObjectURL(file) : photoURL}
                  alt="Vista previa"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />

            {uploading && (
              <p className="text-sm text-blue-600 mt-1">Subiendo imagen...</p>
            )}
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+54 11 1234 5678"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contraseña actual (para reautenticar) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Necesaria para cambiar email o contraseña.
            </p>
          </div>

          {/* Nueva contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña (opcional)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Dejar vacío si no quieres cambiarla"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
          >
            {uploading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
