// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-900">
      {/* ========== HEADER / NAVBAR ========== */}
      <header className="bg-[#51016d] shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex justify-between items-center">
          <img src="/img/atenealogo.png" className="w-20" />
          <nav className="hidden md:flex space-x-8">
            <a
              href="#programs"
              className="text-white mt-2 hover:text-primary transition"
            >
              Programas
            </a>
            <a
              href="#mentors"
              className="text-white mt-2 hover:text-primary transition"
            >
              Mentores
            </a>
            <a
              href="#philosophy"
              className="text-white mt-2 hover:text-primary transition"
            >
              Filosofía
            </a>
            <a
              href="#contact"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Contacto
            </a>
          </nav>
          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            {/* Puedes agregar más formatos si es necesario */}
            Tu navegador no soporta el video.
          </video>
          {/* Overlay oscuro con gradiente para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-900 opacity-80"></div>
        </div>

        {/* Contenido centrado */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            Conocimiento que{" "}
            <span className="text-accent">construye futuros</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white opacity-90">
            Donde la sabiduría se convierte en estrategia. Forjamos líderes con
            visión, carácter y competencias para el mundo real.
          </p>
          <div className="space-x-4">
            <a
              href="#contact"
              className="bg-accent text-primary font-semibold px-8 py-4 rounded-lg inline-block shadow-lg hover:scale-105 transition-transform duration-300 transform"
            >
              Empieza tu transformación
            </a>
            <a
              href="#programs"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg inline-block hover:bg-white hover:text-primary transition-colors duration-300"
            >
              Conoce nuestros programas
            </a>
          </div>
        </div>

        {/* Degradado de transición al siguiente bloque */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Por qué elegir Atenea College
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una formación que va más allá del aula. Preparamos líderes para el
              mundo real.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Ecosistema sinérgico",
                desc: "Conectamos formación, comunidad y oportunidades en un entorno de crecimiento integral.",
              },
              {
                title: "Mentores expertos",
                desc: "Accede a líderes consolidados que te guiarán con coaching ejecutivo y asesoría práctica.",
              },
              {
                title: "Aprender haciendo",
                desc: "Metodología basada en proyectos, simuladores y desafíos reales del mercado.",
              },
              {
                title: "Flexibilidad total",
                desc: "Cursos 100% online, presenciales o híbridos, adaptados a tu ritmo de vida.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROGRAMS / ESCUELAS ========== */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
            Áreas de Capacitación
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            El conocimiento que tu carrera necesita, diseñado por expertos del
            mercado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Escuela 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Escuela de Negocios e Inversión
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-700">
                  • Agente Inmobiliario Profesional
                </li>
                <li className="text-gray-700">• Asesor de Seguros</li>
                <li className="text-gray-700">• Inversiones Inteligentes</li>
                <li className="text-gray-700">• Gestión de Emprendedurismo</li>
              </ul>
            </div>
            {/* Escuela 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Escuela de Gestión y Operaciones
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-700">• Facturación Electrónica</li>
                <li className="text-gray-700">• Liquidación de Sueldos</li>
                <li className="text-gray-700">
                  • Marketing (Digital, Operativo, Estratégico)
                </li>
                <li className="text-gray-700">• Ventas</li>
                <li className="text-gray-700">• Gestión de Equipos</li>
                <li className="text-gray-700">
                  • Desarrollo de Talento Humano
                </li>
              </ul>
            </div>
            {/* Escuela 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Escuela de Expansión y Franquicias
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-700">
                  • Desarrollo y Gestión de Franquicias
                </li>
                <li className="text-gray-700">• Modelo Legal y Financiero</li>
                <li className="text-gray-700">
                  • Operación y Marketing de Redes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MENTORES ========== */}
      <section id="mentors" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Programa de Mentores
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos talento emergente con líderes consolidados. A través de
            coaching ejecutivo y asesoría entre pares, aceleramos tu crecimiento
            profesional.
          </p>
          <div className="bg-gradient-to-r from-primary to-blue-900 text-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              La sabiduría de la experiencia está a tu alcance
            </h3>
            <p className="text-lg opacity-90">
              Formando líderes a través del coaching y el aprendizaje
              colaborativo.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FILOSOFÍA EDUCATIVA ========== */}
      <section id="philosophy" className="py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Filosofía Educativa
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Nuestros programas son experiencias prácticas, impartidas por
            expertos del sector, enfocadas en resultados reales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            {[
              "Aprende, aplica e impulsa el futuro",
              "Programas a medida con diagnóstico previo",
              "Metodología “aprender haciendo”",
              "Flexibilidad total: online, híbrido, presencial",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-lg hover:bg-white/20 transition"
              >
                <p className="font-medium">→ {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA / CONTACTO ========== */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Tu futuro es nuestra razón de ser
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            No solo te formamos, te preparamos para triunfar.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-primary mb-4">
              ¡Contáctanos!
            </h3>
            <p className="text-gray-700 mb-6">
              Empecemos a construir tu futuro juntos.
            </p>
            <div className="space-y-3 text-lg">
              <p>
                📧{" "}
                <a
                  href="mailto:bedelia@ateneacollege.com"
                  className="text-primary hover:underline"
                >
                  bedelia@ateneacollege.com
                </a>
              </p>
              <p>📞 098 119 414</p>
            </div>
            <div className="mt-8">
              <a
                href="mailto:bedelia@ateneacollege.com"
                className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition inline-block"
              >
                Enviar correo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Atenea College</h3>
          <p className="text-gray-400 mb-6">
            Unidad educativa de Kleos Group. Conocimiento que construye futuros.
          </p>
          <div className="border-t border-gray-700 pt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Atenea College. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      {/* ========== ESTILOS PERSONALIZADOS (Tailwind con extensiones) ========== */}
      <style jsx global>{`
        :root {
          --primary: #1a365d;
          --secondary: #2c5282;
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

// Componente de menú móvil
function MobileMenu() {
  return (
    <button
      className="md:hidden text-primary"
      onClick={() => {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
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
