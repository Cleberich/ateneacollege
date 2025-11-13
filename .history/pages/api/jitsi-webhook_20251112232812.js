// pages/api/jitsi-webhook.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Ajusta la ruta según tu estructura

// Deshabilitar el body parser predeterminado
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 1. Verificar la autenticidad del webhook (CRÍTICO EN PRODUCCIÓN)
    // JaaS firma los eventos con un header 'x-jitsi-signature'.
    // Debes verificar esta firma con tu API Secret para asegurar que la solicitud
    // proviene de JaaS y no de un atacante.
    // Consulta la documentación de JaaS para implementar la verificación del JWT del evento.
    // Por simplicidad en este ejemplo, se omite, pero es esencial en producción.

    const body = await new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(JSON.parse(body));
      });
    });

    console.log("Webhook recibido", body);

    const event = body;

    // 2. Extraer información del cuerpo del evento
    // Asumimos que el evento es de tipo "recording.status" y el estado es "ready"
    if (
      event.eventType === "recording.status" &&
      event.data.status === "ready"
    ) {
      const recordingUrl = event.data.location; // La URL de descarga de la grabación
      const roomName = event.context.roomName; // Nombre de la sala

      // 3. Extraer courseId y lessonId del roomName
      // Asumiendo el formato: `${courseId}_${jitsiRoom}`
      const [courseId, jitsiRoom] = roomName.split("_");

      if (!courseId || !jitsiRoom) {
        console.error(
          "No se pudo extraer courseId y jitsiRoom del roomName:",
          roomName
        );
        return res.status(400).json({ error: "Formato de roomName inválido" });
      }

      // 4. Buscar la lección específica en Firestore
      // Necesitamos encontrar la lección que tiene `content` === `${courseId}_${jitsiRoom}`
      const courseDocRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseDocRef);

      if (!courseSnap.exists()) {
        console.error("Curso no encontrado:", courseId);
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      const courseData = courseSnap.data();
      const lessons = courseData.lessons || [];

      // Buscar la lección que coincide con el roomName
      const lessonToUpdate = lessons.find(
        (lesson) => lesson.content === roomName
      );

      if (!lessonToUpdate) {
        console.error(
          "Lección no encontrada en el curso con roomName:",
          roomName
        );
        return res
          .status(404)
          .json({ error: "Lección no encontrada en el curso" });
      }

      // 5. Actualizar solo la lección con la URL de la grabación
      const updatedLessons = lessons.map((lesson) => {
        if (lesson.id === lessonToUpdate.id) {
          return {
            ...lesson,
            recordingUrl: recordingUrl,
          };
        }
        return lesson;
      });

      // 6. Actualizar el documento del curso en Firestore
      await updateDoc(courseDocRef, {
        lessons: updatedLessons,
      });

      console.log(
        `Grabación guardada exitosamente para la lección ${lessonToUpdate.id} en el curso ${courseId}`
      );
      return res
        .status(200)
        .json({ success: true, message: "Grabación guardada en Firestore" });
    } else {
      // No es un evento de grabación listo, ignóralo
      console.log(
        "Evento recibido, pero no es de grabación lista:",
        event.eventType
      );
      return res
        .status(200)
        .json({ success: true, message: "Evento no relevante" });
    }
  } catch (error) {
    console.error("Error procesando el webhook de Jitsi:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
