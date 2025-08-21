import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const testFirestore = async () => {
  try {
    console.log("Intentando leer de Firestore...");
    const snapshot = await getDocs(collection(db, "test"));
    console.log("Conexión exitosa. Documentos:", snapshot.size);
  } catch (error) {
    console.error("❌ Error al conectar con Firestore:", error.message);
    console.error("Código:", error.code);
  }
};
