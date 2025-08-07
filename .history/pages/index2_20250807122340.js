// app/page.js
import Link from "next/link";
import Head from "next/head"; // Asegúrate de importar Head

export default function Home() {
  return (
    <div className="font-poppins antialiased text-gray-900">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ========== HEADER / NAVBAR ========== */}
      <header className="bg-[#51016d] shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex justify-between items-center">
          <a href="/">
            <img src="/img/atenealogo.png" className="w-20" />
          </a>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#programs"
              className="text-white mt-2 hover:text-primary transition font-poppins"
            >
              Programas
            </a>
            <a
              href="#mentors"
              className="text-white mt-2 hover:text-primary transition font-poppins"
            >
              Mentores
            </a>
            <a
              href="#philosophy"
              className="text-white mt-2 hover:text-primary transition font-poppins"
            >
              Filosofía
            </a>
            <a
              href="#contact"
              className="bg-[#ad8330] text-white px-5 py-2 rounded-lg hover:bg-opacity-90 transition font-poppins"
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-900 opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white font-lora">
            Conocimiento que{" "}
            <span className="text-accent">construye futuros</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white opacity-90 font-poppins">
            Donde la sabiduría se convierte en estrategia. Forjamos líderes con
            visión, carácter y competencias para el mundo real.
          </p>
          <div className="space-x-4">
            <a
              href="#contact"
              className="bg-[#ad8330] text-white font-semibold px-8 py-4 rounded-lg inline-block shadow-lg hover:scale-105 transition-transform duration-300 transform font-poppins"
            >
              Empieza tu transformación
            </a>
            <a
              href="#programs"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg inline-block hover:bg-white hover:text-primary transition-colors duration-300 font-poppins"
            >
              Conoce nuestros programas
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-lora">
              Por qué elegir Atenea College
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins">
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
                <h3 className="text-xl font-semibold text-primary mb-3 font-lora">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-poppins">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROGRAMS / ESCUELAS ========== */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4 font-lora">
            Áreas de Capacitación
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto font-poppins">
            El conocimiento que tu carrera necesita, diseñado por expertos del
            mercado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Escuelas (contenido igual, pero con fuentes mejoradas) */}
            {/* ... (igual que antes, pero asegúrate de usar font-lora en títulos y font-poppins en texto) */}
          </div>
        </div>
      </section>

      {/* ========== MENTORES, FILOSOFÍA, CONTACTO, FOOTER ========== */}
      {/* Repite la misma lógica: usa `font-lora` para títulos y `font-poppins` para párrafos y botones */}
      {/* ... (resto del contenido con fuentes aplicadas) */}

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center">
            <img src="/img/atenealogo.png" className="w-20" />
          </div>
          <p className="text-gray-400 mb-6 font-poppins">
            Unidad educativa de Kleos Group. Conocimiento que construye futuros.
          </p>
          <div className="border-t border-gray-700 pt-6 text-sm text-gray-500 font-poppins">
            © {new Date().getFullYear()} Atenea College. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      {/* ========== CUSTOM FONTS ========== */}
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

        /* Fuentes personalizadas */
        .font-lora {
          font-family: "Lora", serif;
        }
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }

        body {
          font-family: "Poppins", sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Lora", serif;
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

function MobileMenu() {
  return (
    <button
      className="md:hidden text-primary"
      onClick={() => {
        const menu = document.getElementById("mobile-menu");
        menu?.classList.toggle("hidden");
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
