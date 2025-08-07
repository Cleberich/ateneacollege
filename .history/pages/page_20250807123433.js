// app/plataforma/page.js
import Link from "next/link";
import Head from "next/head";

export default function PlataformaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Head>
        <title>Plataforma Estudiantil | Atenea College</title>
        <meta
          name="description"
          content="Accede a tus clases, cursos y recursos educativos."
        />
      </Head>

      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/img/atenealogo.png"
              alt="Atenea College"
              className="w-12"
            />
            <span className="text-xl font-semibold text-primary font-lora">
              Plataforma
            </span>
          </div>
          <Link href="/">
            <a className="text-primary hover:underline font-poppins">
              ← Volver al sitio
            </a>
          </Link>
        </div>
      </header>

      {/* ========== HERO / ACCESO ========== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-lora">
            Bienvenido a tu <span className="text-accent">Aula Virtual</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 font-poppins">
            Accede a tus cursos, materiales, tareas y mentorías desde cualquier
            dispositivo.
          </p>

          {/* Botón de acceso */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-6 font-lora">
              Inicia sesión
            </h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Correo institucional"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Entrar a mis clases
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4 font-poppins">
              ¿No tienes acceso? Contacta a{" "}
              <a
                href="mailto:bedelia@ateneacollege.com"
                className="text-primary hover:underline"
              >
                bedelia@ateneacollege.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ========== CURSOS RECIENTES (ejemplo) ========== */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary text-center mb-12 font-lora">
            Tus Cursos Recientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Marketing Digital",
                teacher: "Lic. Marta Ríos",
                progress: 65,
              },
              {
                name: "Inversiones Inteligentes",
                teacher: "Dr. Carlos Méndez",
                progress: 80,
              },
              {
                name: "Gestión de Equipos",
                teacher: "Ing. Lucía Paredes",
                progress: 40,
              },
            ].map((course, i) => (
              <Link key={i} href={`/plataforma/curso/${i + 1}`}>
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition cursor-pointer border border-gray-200">
                  <h3 className="text-xl font-semibold text-primary mb-2 font-lora">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 mb-3 font-poppins">
                    Profesor: {course.teacher}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-poppins">
                    Progreso: {course.progress}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-8 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Atenea College. Todos los derechos
          reservados.
        </p>
        <p className="text-gray-400 mt-1">Unidad educativa de Kleos Group</p>
      </footer>
    </div>
  );
}
