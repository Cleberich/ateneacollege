// app/page.js
import { Montserrat, Playfair_Display } from "next/font/google";
import Link from "next/link";

// Carga de fuentes (puedes mover esto a layout.js si usas en toda la app)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Home() {
  return (
    <div
      className={`${playfair.variable} ${montserrat.variable} font-sans antialiased text-gray-900`}
    >
      {/* ========== HEADER / NAVBAR (Transparente sobre hero, sólido después) ========== */}
      <header className="bg-primary shadow-none fixed w-full top-0 z-50 transition-all duration-500 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-6 py-0 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/img/atenealogo.png"
              alt="Atenea College"
              className="w-16 md:w-20"
            />
            <span className="ml-3 text-xl font-bold text-primary hidden sm:inline">
              Atenea College
            </span>
          </Link>
          <nav className="hidden md:flex space-x-10">
            <a
              href="#programs"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Programas
            </a>
            <a
              href="#mentors"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Mentores
            </a>
            <a
              href="#philosophy"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Filosofía
            </a>
            <a
              href="#contact"
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Contacto
            </a>
          </nav>
          <MobileMenu />
        </div>
      </header>

      {/* ========== HERO SECTION (Cinematográfico y elegante) ========== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/video/hero-video.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Conocimiento que <br />
            <span className="text-accent font-serif">construye futuros</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Donde la sabiduría se convierte en estrategia. Formamos líderes con
            visión, carácter y competencias para el mundo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#contact"
              className="bg-primary text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
            >
              Empieza tu transformación
            </a>
            <a
              href="#programs"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-primary hover:text-opacity-90 transition-all duration-300"
            >
              Explorar programas
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <a href="#features" className="text-white opacity-70 text-sm">
            Desplázate para saber más
          </a>
          <div className="mt-2 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ========== FEATURES (Estilo institucional premium) ========== */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Por qué elegir Atenea College
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una formación rigurosa, humana y transformadora. Preparamos
              líderes para el mundo del mañana.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Ecosistema sinérgico",
                desc: "Integramos formación, comunidad y oportunidades en un entorno de crecimiento continuo.",
              },
              {
                title: "Mentores expertos",
                desc: "Aprende directamente de líderes con trayectoria comprobada y coaching ejecutivo personalizado.",
              },
              {
                title: "Aprender haciendo",
                desc: "Metodología basada en proyectos reales, simulaciones y retos del mercado actual.",
              },
              {
                title: "Flexibilidad total",
                desc: "Modalidades 100% online, presenciales o híbridas, diseñadas para tu ritmo de vida.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
              >
                <h3 className="text-xl font-semibold text-primary mb-4 group-hover:text-accent transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROGRAMS / ESCUELAS (Diseño de panel académico) ========== */}
      <section id="programs" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
            Áreas de Capacitación
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            El conocimiento que tu carrera necesita, diseñado por expertos del
            mercado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Escuela de Negocios e Inversión",
                courses: [
                  "Agente Inmobiliario Profesional",
                  "Asesor de Seguros",
                  "Inversiones Inteligentes",
                  "Gestión de Emprendedurismo",
                ],
              },
              {
                title: "Escuela de Gestión y Operaciones",
                courses: [
                  "Facturación Electrónica",
                  "Liquidación de Sueldos",
                  "Marketing (Digital, Operativo, Estratégico)",
                  "Ventas",
                  "Gestión de Equipos",
                  "Desarrollo de Talento Humano",
                ],
              },
              {
                title: "Escuela de Expansión y Franquicias",
                courses: [
                  "Desarrollo y Gestión de Franquicias",
                  "Modelo Legal y Financiero",
                  "Operación y Marketing de Redes",
                ],
              },
            ].map((school, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-3 border-gray-200">
                  {school.title}
                </h3>
                <ul className="space-y-3">
                  {school.courses.map((course, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MENTORES (Estilo premium) ========== */}
      <section id="mentors" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Programa de Mentores
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Conectamos talento emergente con líderes consolidados. A través de
            coaching ejecutivo y mentoría estratégica, aceleramos tu crecimiento
            profesional.
          </p>
          <div className="bg-gradient-to-br from-primary to-secondary text-white p-10 rounded-3xl shadow-xl max-w-4xl mx-auto transform transition hover:scale-[1.02] duration-300">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              La sabiduría de la experiencia está a tu alcance
            </h3>
            <p className="text-lg opacity-95">
              Formamos líderes a través del coaching personalizado y el
              aprendizaje colaborativo.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FILOSOFÍA EDUCATIVA (Glassmorphism sutil) ========== */}
      <section id="philosophy" className="py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Filosofía Educativa
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Nuestros programas son experiencias prácticas, impartidas por
            expertos del sector, enfocadas en resultados reales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Aprende, aplica e impulsa el futuro",
              "Programas a medida con diagnóstico previo",
              "Metodología 'aprender haciendo'",
              "Flexibilidad total: online, híbrido, presencial",
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/20"
              >
                <p className="font-medium text-lg">→ {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA / CONTACTO (Diseño de tarjeta institucional) ========== */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Tu futuro es nuestra razón de ser
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            No solo te formamos, te preparamos para triunfar.
          </p>
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-primary mb-5">
              Contáctanos hoy
            </h3>
            <p className="text-gray-700 mb-8">
              Empecemos a construir tu futuro juntos.
            </p>
            <div className="space-y-4 text-lg text-gray-800">
              <p>
                📧{" "}
                <a
                  href="mailto:bedelia@ateneacollege.com"
                  className="text-primary hover:underline font-medium"
                >
                  bedelia@ateneacollege.com
                </a>
              </p>
              <p>
                📞 <span className="font-medium">098 119 414</span>
              </p>
            </div>
            <div className="mt-10">
              <a
                href="mailto:bedelia@ateneacollege.com"
                className="bg-primary text-white font-semibold px-10 py-4 rounded-full hover:bg-opacity-95 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Enviar correo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <img src="/img/atenealogo.png" alt="Logo Atenea" className="w-16" />
          </div>
          <h3 className="text-xl font-bold mb-2">Atenea College</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Unidad educativa de Kleos Group. Conocimiento que construye futuros.
          </p>
          <div className="border-t border-gray-700 pt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Atenea College. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      {/* ========== ESTILOS GLOBALES Y PERSONALIZADOS ========== */}
      <style jsx global>{`
        :root {
          --primary: #51016d;
          --secondary: #673b76;
          --accent: #f6ad55;
        }
        .text-primary {
          color: var(--primary);
        }
        .bg-primary {
          background-color: var(--primary);
        }
        .bg-accent {
          background-color: var(--accent);
        }
        body {
          font-family: ${montserrat.style.fontFamily};
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: ${playfair.style.fontFamily};
        }
        @media (max-width: 768px) {
          .mobile-menu {
            display: none;
          }
          .mobile-menu.active {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

// Menú móvil mejorado
function MobileMenu() {
  return (
    <button
      className="md:hidden text-primary p-2"
      onClick={() => {
        const menu = document.getElementById("mobile-menu-overlay");
        menu.classList.remove("hidden");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
