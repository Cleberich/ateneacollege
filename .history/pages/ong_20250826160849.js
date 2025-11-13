import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>ONG Innovación Social - Transformando vidas</title>
        <meta
          name="description"
          content="ONG dedicada a la educación, medio ambiente y desarrollo comunitario."
        />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="true"
        />
      </Head>

      {/* Header */}
      <header className="bg-white blur-10 shadow-md sticky top-0 z-50">
        <div className="flex justify-left px-12 md:px-32 bg-blue-300 ">
          {" "}
          <p className="text-black my-1 ml-2 text-md">
            Los niños te necesitan, <b>¡sumate a la causa!</b>
          </p>
        </div>
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <div className="text-2xl flex font-bold text-white tracking-wide">
            <img src="/img/logo.png" className="w-20" />{" "}
            <p className="text-black mt-4 ml-2 text-[15px] md:flex hidden">
              Un camino hacia el desarrollo sostenible
            </p>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#home"
                  className="text-black hover:text-blue-700 transition"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#quienes-somos"
                  className="text-black hover:text-blue-700 transition"
                >
                  Quiénes somos
                </a>
              </li>
              <li>
                <a
                  href="#proyectos"
                  className="text-black hover:text-blue-700 transition"
                >
                  Proyectos
                </a>
              </li>
              <li>
                <a
                  href="#donaciones"
                  className="text-black hover:text-blue-700 transition"
                >
                  Donar
                </a>
              </li>
              <li>
                <a
                  href="#voluntario"
                  className="text-black hover:text-blue-700 transition"
                >
                  Voluntario
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative h-screen mt-0 z-10 flex items-center justify-center text-center px-6 overflow-hidden"
      >
        {/* Video de Fondo */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            {/* 
        📌 Coloca tu video en: public/videos/hero-bg.mp4 
        Ejemplos de videos: personas colaborando, comunidades, naturaleza, educación, progreso.
      */}
            <source src="/video/ong.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          {/* Overlay degradado para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 opacity-80"></div>
        </div>

        {/* Contenido centrado */}
        <div className="relative z-10 max-w-5xl mx-auto text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transformamos vidas, <br />
            <span className="text-blue-300 drop-shadow-lg">
              construimos futuro
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow">
            Trabajamos por la educación, la justicia social, la protección
            ambiental y el desarrollo comunitario.
          </p>
          <div className="space-x-4">
            <a
              href="#donaciones"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
            >
              Donar ahora
            </a>
            <a
              href="#voluntario"
              className="border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow"
            >
              Ser voluntario
            </a>
          </div>
        </div>

        {/* Flecha de desplazamiento (opcional) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#sobre-nosotros" className="text-white text-3xl opacity-80">
            ↓
          </a>
        </div>
      </section>

      {/* ¿Quiénes somos? */}
      <section id="quienes-somos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Quiénes somos?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Misión</h3>
              <p className="text-gray-700 mb-6">
                Promover el desarrollo integral de comunidades vulnerables
                mediante la educación, el liderazgo juvenil y la sostenibilidad
                ambiental.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Visión</h3>
              <p className="text-gray-700">
                Ser una organización referente en transformación social,
                empoderando a personas y comunidades para un futuro más justo y
                sostenible.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Equipo de ONG"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestro equipo
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Conocé a la comisión directiva y al equipo que impulsa nuestro
            trabajo diario.
          </p>

          {/* Comisión directiva */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Ana López",
                role: "Presidenta",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Napoleon Yancent",
                role: "Presidente",
                img: "/ong/napoleon.png",
              },
              {
                name: "Lucía Ríos",
                role: "Coordinadora Social",
                img: "https://randomuser.me/api/portraits/women/68.jpg",
              },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-700">{member.role}</p>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline mt-2 block"
                >
                  LinkedIn
                </a>
              </div>
            ))}
          </div>

          {/* Organigrama */}
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Organigrama</h3>
            <img
              src="https://via.placeholder.com/600x400?text=Organigrama+ONG"
              alt="Organigrama de la ONG"
              className="max-w-full mx-auto rounded shadow"
            />
            <p className="text-sm text-gray-500 mt-4">
              Estructura organizacional clara y transparente.
            </p>
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Proyectos clave
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Educación y Liderazgo",
                desc: "Formamos jóvenes líderes con becas y talleres.",
              },
              {
                title: "Agroecología",
                desc: "Promovemos huertas comunitarias sostenibles.",
              },
              {
                title: "Economía Circular",
                desc: "Reciclaje, reuso y emprendimientos verdes.",
              },
              {
                title: "Apoyo Psicosocial",
                desc: "Acompañamiento emocional y salud mental.",
              },
              {
                title: "Emprendimientos",
                desc: "Capacitación y microcréditos para emprendedores.",
              },
              {
                title: "Protección Ambiental",
                desc: "Limpieza de ríos, reforestación y educación.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo ayudamos (con imágenes) */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo ayudamos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src="https://images.unsplash.com/photo-1574607383476-f51450896399?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Niños comiendo"
                className="rounded-lg shadow mb-4"
              />
              <p className="text-center text-gray-600">
                Niños recibiendo alimentación digna.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Limpieza ambiental"
                className="rounded-lg shadow mb-4"
              />
              <p className="text-center text-gray-600">
                Voluntarios limpiando espacios públicos.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1577924414153-4184ce66395c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Huerta comunitaria"
                className="rounded-lg shadow mb-4"
              />
              <p className="text-center text-gray-600">
                Familias cultivando en huertas agroecológicas.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd21189a02d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Apoyo psicosocial"
                className="rounded-lg shadow mb-4"
              />
              <p className="text-center text-gray-600">
                Talleres de salud emocional y contención.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trabajos realizados */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Impacto en números</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-10">
            {[
              { num: "500+", label: "Niños beneficiados" },
              { num: "120", label: "Voluntarios activos" },
              { num: "30", label: "Proyectos completados" },
              { num: "15", label: "Comunidades impactadas" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-green-600">
                  {item.num}
                </div>
                <div className="text-gray-600 mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hazte voluntario */}
      <section id="voluntario" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Hazte voluntario
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Únete a nuestra red de voluntarios y transforma vidas mientras
            creces personal y profesionalmente.
          </p>
          <div className="bg-green-50 p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Beneficios del voluntariado:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Becas de estudio para voluntarios destacados</li>
              <li>Becas para prácticas deportivas y culturales</li>
              <li>
                Capacitaciones en liderazgo, sustentabilidad y trabajo en equipo
              </li>
              <li>Experiencia valiosa para tu CV</li>
            </ul>
            <div className="text-center">
              <a
                href="mailto:voluntarios@ong.org"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Quiero ser voluntario
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Donaciones */}
      <section id="donaciones" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Tu ayuda cambia vidas
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Colaborá con donaciones económicas o en especie. Cada aporte suma.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Doná ahora</h3>
              <div className="space-y-4">
                <a
                  href="https://www.mercadopago.com.ar/donar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Donar con MercadoPago
                </a>
                <a
                  href="https://www.paypal.com/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition"
                >
                  Donar con PayPal
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Transferencia bancaria
              </h3>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="mb-2">
                  <strong>CBU:</strong> 1234567890123456789012
                </p>
                <p className="mb-2">
                  <strong>Alias:</strong> ONG.DONAR.AHORA
                </p>
                <p className="mb-2">
                  <strong>Banco:</strong> Banco de la Nación Argentina
                </p>
                <p className="mb-2">
                  <strong>Nombre:</strong> ONG Esperanza
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Enviá el comprobante a:{" "}
                  <a href="mailto:donaciones@ong.org" className="text-blue-600">
                    donaciones@ong.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">ONG Esperanza</h3>
              <p>Trabajamos por un futuro más justo, sostenible y educado.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p>
                📧 <a href="mailto:contacto@ong.org">contacto@ong.org</a>
              </p>
              <p>📞 +54 9 11 1234-5678</p>
              <p>📍 Buenos Aires, Argentina</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="hover:text-yellow-400">
                  Facebook
                </a>
                <a href="#" className="hover:text-yellow-400">
                  Instagram
                </a>
                <a href="#" className="hover:text-yellow-400">
                  YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ONG Esperanza. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
