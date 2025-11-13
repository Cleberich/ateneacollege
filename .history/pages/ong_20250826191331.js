import Head from "next/head";
import { useState } from "react"; // Necesario para el estado del menú

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú

  const navItems = [
    { name: "Inicio", href: "#home" },
    { name: "Quiénes somos", href: "#quienes-somos" },
    { name: "Proyectos", href: "#proyectos" },
    { name: "Donar", href: "#donaciones" },
    { name: "Voluntario", href: "#voluntario" },
  ];

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
        <div className="flex justify-center px-4 sm:px-12 md:px-32 bg-blue-300">
          <p className="text-black my-1 ml-2 text-sm sm:text-md">
            Los niños te necesitan, <b>¡sumate a la causa!</b>
          </p>
        </div>
        <div className=" mx-auto px-4 sm:px-6 py-2">
          {/* Barra superior: Logo y botón hamburguesa */}
          <div className="flex bg-red-500 justify-between items-center">
            <div className="text-2xl  text-blue-600 tracking-wide flex items-center">
              <img src="/img/logo.png" className="w-16 sm:w-20" alt="Logo" />
              <p className="text-black mt-2 ml-2 text-[12px] sm:text-[15px] md:flex hidden">
                Un camino hacia el desarrollo sostenible
              </p>
              <nav
                className={`${
                  menuOpen ? "block" : "hidden"
                } sm:block absolute sm:relative top-full left-0 w-full bg-white shadow-md sm:shadow-none z-40 transition-all duration-300 ease-in-out`}
              >
                <ul className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-6 py-4 sm:py-0 px-4 sm:px-0">
                  {navItems.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        className="block text-black hover:text-blue-700 transition text-sm sm:text-base py-2 sm:py-0"
                        onClick={() => setMenuOpen(false)} // Cierra el menú al hacer clic
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Botón hamburguesa (solo en móvil) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-black focus:outline-none z-50"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <a
              href="#donaciones"
              onClick={() => setMenuOpen(false)}
              className="block bg-blue-600 text-md text-center p-2 rounded-lg mx-1  text-white hover:bg-blue-700 transition shadow"
            >
              Donar ahora
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative h-screen mt-0 z-10 flex items-center justify-center text-center px-4 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/ong.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-4xl sm:max-w-5xl mx-auto text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Transformamos vidas, <br />
            <span className="text-blue-300 drop-shadow-lg">
              construimos futuro
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-xl sm:max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed drop-shadow">
            Trabajamos por la educación, la justicia social, la protección
            ambiental y el desarrollo comunitario.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4 space-y-4 sm:space-y-0">
            <a
              href="#donaciones"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
            >
              Donar ahora
            </a>
            <a
              href="#voluntario"
              className="border-2 border-white hover:bg-white hover:text-gray-800 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow"
            >
              Ser voluntario
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a
            href="#quienes-somos"
            className="text-white text-2xl sm:text-3xl opacity-80"
          >
            ↓
          </a>
        </div>
      </section>

      {/* ¿Quiénes somos? */}
      <section id="quienes-somos" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center">
            <div className="lg:w-1/2 space-y-6 sm:space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center lg:text-left">
                ¿Quiénes somos?
              </h2>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-3 flex items-center">
                  <span className="w-2 h-6 sm:h-8 bg-blue-500 rounded-r-full mr-3"></span>
                  Misión
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Promovemos el desarrollo integral de comunidades vulnerables
                  mediante{" "}
                  <strong>
                    la educación transformadora, el liderazgo juvenil
                  </strong>{" "}
                  y <strong>la sostenibilidad ambiental</strong>. Trabajamos de
                  la mano con familias, jóvenes y organizaciones locales para
                  construir un futuro más justo.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 flex items-center">
                  <span className="w-2 h-6 sm:h-8 bg-green-500 rounded-r-full mr-3"></span>
                  Visión
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Ser una organización referente en transformación social,{" "}
                  <strong>empoderando personas y comunidades</strong> para que
                  lideren su propio desarrollo. Soñamos con un mundo donde cada
                  individuo tenga acceso a oportunidades dignas y viva en
                  armonía con el entorno.
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <img
                  src="/ong/mision.jpg"
                  alt="Equipo de la ONG trabajando con la comunidad"
                  className="rounded-2xl shadow-xl object-cover w-full h-60 sm:h-80 md:h-96"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 bg-blue-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-lg font-medium text-xs sm:text-sm">
                  +5 años transformando vidas
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 sm:mb-8">
              Nuestros valores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl sm:max-w-4xl mx-auto">
              {["Empatía", "Integridad", "Sostenibilidad"].map((valor, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <p className="text-base sm:text-lg font-medium text-gray-800">
                    {valor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 sm:py-20 bg-green-100">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Nuestro equipo
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 max-w-xs sm:max-w-2xl mx-auto text-sm sm:text-base">
            Conocé a la comisión directiva y al equipo que impulsa nuestro
            trabajo diario.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-12 sm:mb-16">
            {[
              {
                name: "Napoleon Yancent",
                role: "Presidente",
                img: "/ong/napoleon.png",
              },
              {
                name: "Eliseo Valdera",
                role: "Secretario Ejecutivo",
                img: "/ong/eliseo.jpeg",
              },
              {
                name: "Daniel Guadalupe",
                role: "Vicepresidente",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAACUCAMAAABcK8BVAAAAMFBMVEXk5ueutLfn6eqrsbS+w8Wxt7rc3+Df4uPLz9HU19nHy83Y29y3vL+7wMLQ1NXCx8lJAdLWAAAEFklEQVR4nO2b2ZKsIAyGIciiqLz/2x7oZRq7XRASsOr4X0zVzM18FbMASRi7devWrVu3bt269d8IAFojfCsQadXPxpjZKv38wwXkMfqhk+KjsTM9uwKc7SQXgsfyv8rOtqUDbeQX1odPGt0MDmCQG1wvuKGV5Wa+B/aEmxuwgZ6OwB5wXX3DzVs+9gPX12WDIREssA1V2cZ0ssdHvSiZZxur2W03Zayz6TpkSaH5xTbVsBtkkHk2R88GJofMsxlqNuizwAKbJUbTuWScS9pQgC7vcz7MNpCizflk4ZNSuttYQEaaeXOj80+EUSrLyPhIBVZsNC7ITpZFnvY0Gw0a9KVGIwvSvOL5heYoyEoKwUckJQEMBhpNJXXl35PocKTL4/PBRoCmMIzm0fCdDYoqe4SGn3VLjkMLNPxbKZTWz7cmbDIGOEbztQrd2TQWGn7SRQpQj6aQycBioaHXA4xjx412oyWhXTgM0NA4dvK4cF5j7LqFCq2GEpR3nEMuxXP4mU7Brgi6CEiJjaL5gnU3QAdjGC8eQZLgRgU491CKhlX+2/cCDT/hBmGg0XSEMNIHVQMSI0Zpvidjxbdk0RE9mJa/LRAFASuvo2RGQziFE3bQyt5kaHuiqshopK29kq4GXT/jxXZyWCEio4uBl1T2OxsxWMGtj7q/zXLdrc5kUQ4b/bzCi+30obIW2Xm71SM7y0ad0L7YbPLIk5Cq8mxd2jxiyLT150zheIqz1RynN5w7mJcUwjUbzVXTjuUEnyp72UKghvVxZiFG1xLsAadtF2bSY6rwJW27KetIAGp20yifGic3q4tM9Qc9Ng608tL6KtsGQbCi1kxPKG17Y5zrXnJuMHOvdDNA/2+16o37bGd8oiCEQfjpnc7W3iZ5+r3k4jDlCjk6Y+vYz/8T1XeHUIvM63OcUZp4uB+YHaYTWIsMPNN9Wm+v4WfD5gQd51PPKGwHykzZWH94crDYpgPVba7+nLTdOCPCAZvLDRbTDVj1Febsx4QtOJQtJm+x04sPKXBiKD0ygUIYkFyHk0U3wOS7SR6c6LPBDvbeEOCmPJcDi+39K2xZ9/qkuxwCXMY1ldLLljo34Aw9sZfFOtW3whrZTGVLnxTAacqeYZOJDledLP01qV4AxEoIBozR/RzJY7ZGZPzQblgzyxkSfD8W6kdApL2J3fKVnyLtrYChjc/lsm02TDXWBHo+28bLb6u0sWBbdbfKhXNDq6tz7T9n0NrZskHlXNXKJ20dnW+tRCnSlCaCvgoWznAain7GB65jtO/Bo6t4WtDSbDC15lkoNhvKfiWa4tzW+MTxo7gkXKB6xooCAW19C0mfS/M1Cnusv5HnhheCLb0LKbQG+dHfBNK1UkfQ29nwVqTQ9F6Px9kax9Xkne0fpSo4qb/h7YEAAAAASUVORK5CYII=",
              },
              {
                name: "José Luis de la Cruz",
                role: "Director Administrativo",
                img: "/ong/jose.jpeg",
              },
              {
                name: "Otoniel Valdera",
                role: "Subdirector Administrativo",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAACUCAMAAABcK8BVAAAAMFBMVEXk5ueutLfn6eqrsbS+w8Wxt7rc3+Df4uPLz9HU19nHy83Y29y3vL+7wMLQ1NXCx8lJAdLWAAAEFklEQVR4nO2b2ZKsIAyGIciiqLz/2x7oZRq7XRASsOr4X0zVzM18FbMASRi7devWrVu3bt269d8IAFojfCsQadXPxpjZKv38wwXkMfqhk+KjsTM9uwKc7SQXgsfyv8rOtqUDbeQX1odPGt0MDmCQG1wvuKGV5Wa+B/aEmxuwgZ6OwB5wXX3DzVs+9gPX12WDIREssA1V2cZ0ssdHvSiZZxur2W03Zayz6TpkSaH5xTbVsBtkkHk2R88GJofMsxlqNuizwAKbJUbTuWScS9pQgC7vcz7MNpCizflk4ZNSuttYQEaaeXOj80+EUSrLyPhIBVZsNC7ITpZFnvY0Gw0a9KVGIwvSvOL5heYoyEoKwUckJQEMBhpNJXXl35PocKTL4/PBRoCmMIzm0fCdDYoqe4SGn3VLjkMLNPxbKZTWz7cmbDIGOEbztQrd2TQWGn7SRQpQj6aQycBioaHXA4xjx412oyWhXTgM0NA4dvK4cF5j7LqFCq2GEpR3nEMuxXP4mU7Brgi6CEiJjaL5gnU3QAdjGC8eQZLgRgU491CKhlX+2/cCDT/hBmGg0XSEMNIHVQMSI0Zpvidjxbdk0RE9mJa/LRAFASuvo2RGQziFE3bQyt5kaHuiqshopK29kq4GXT/jxXZyWCEio4uBl1T2OxsxWMGtj7q/zXLdrc5kUQ4b/bzCi+30obIW2Xm71SM7y0ad0L7YbPLIk5Cq8mxd2jxiyLT150zheIqz1RynN5w7mJcUwjUbzVXTjuUEnyp72UKghvVxZiFG1xLsAadtF2bSY6rwJW27KetIAGp20yifGic3q4tM9Qc9Ng608tL6KtsGQbCi1kxPKG17Y5zrXnJuMHOvdDNA/2+16o37bGd8oiCEQfjpnc7W3iZ5+r3k4jDlCjk6Y+vYz/8T1XeHUIvM63OcUZp4uB+YHaYTWIsMPNN9Wm+v4WfD5gQd51PPKGwHykzZWH94crDYpgPVba7+nLTdOCPCAZvLDRbTDVj1Febsx4QtOJQtJm+x04sPKXBiKD0ygUIYkFyHk0U3wOS7SR6c6LPBDvbeEOCmPJcDi+39K2xZ9/qkuxwCXMY1ldLLljo34Aw9sZfFOtW3whrZTGVLnxTAacqeYZOJDledLP01qV4AxEoIBozR/RzJY7ZGZPzQblgzyxkSfD8W6kdApL2J3fKVnyLtrYChjc/lsm02TDXWBHo+28bLb6u0sWBbdbfKhXNDq6tz7T9n0NrZskHlXNXKJ20dnW+tRCnSlCaCvgoWznAain7GB65jtO/Bo6t4WtDSbDC15lkoNhvKfiWa4tzW+MTxo7gkXKB6xooCAW19C0mfS/M1Cnusv5HnhheCLb0LKbQG+dHfBNK1UkfQ29nwVqTQ9F6Px9kax9Xkne0fpSo4qb/h7YEAAAAASUVORK5CYII=",
              },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow"
                />
                <h3 className="text-sm sm:text-xl font-semibold">
                  {member.name}
                </h3>
                <p className="text-blue-700 text-xs sm:text-sm">
                  {member.role}
                </p>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-blue-600 hover:underline mt-1 block"
                >
                  LinkedIn
                </a>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-inner">
            <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 text-center">
              Organigrama
            </h3>
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow font-semibold min-w-32 sm:min-w-48 text-sm sm:text-base">
                  Napoleon Yancent
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Presidente
                </div>
              </div>
              <div className="w-0.5 h-4 sm:h-6 bg-gray-400"></div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow font-semibold min-w-32 sm:min-w-48 text-sm sm:text-base">
                    Daniel Guadalupe
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Vicepresidente
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow font-semibold min-w-32 sm:min-w-48 text-sm sm:text-base">
                    Eliseo Valdera
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Secretario Ejecutivo
                  </div>
                </div>
              </div>
              <div className="flex space-x-12">
                <div className="w-0.5 h-4 sm:h-6 bg-gray-400"></div>
                <div className="w-0.5 h-4 sm:h-6 bg-gray-400"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow font-semibold min-w-32 sm:min-w-48 text-sm sm:text-base">
                  José Luis de la Cruz
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Director Administrativo
                </div>
              </div>
              <div className="w-0.5 h-4 sm:h-6 bg-gray-400"></div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow font-semibold min-w-32 sm:min-w-48 text-sm sm:text-base">
                  Otoniel Valdera
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Subdirector Administrativo
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 text-center">
              Estructura organizacional clara y transparente.
            </p>
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            Proyectos clave
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-xs sm:max-w-3xl mx-auto text-sm sm:text-base">
            Impulsamos iniciativas transformadoras que empoderan comunidades y
            cuidan el planeta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Educación y Liderazgo",
                desc: "Formamos jóvenes líderes con becas, mentorías y talleres de desarrollo personal.",
                img: "/ong/educacion.webp",
              },
              {
                title: "Agroecología",
                desc: "Promovemos huertas comunitarias sostenibles, agricultura orgánica y soberanía alimentaria.",
                img: "/ong/agro.jpg",
              },
              {
                title: "Economía Circular",
                desc: "Fomentamos el reciclaje, reuso de materiales y emprendimientos verdes con bajo impacto ambiental.",
                img: "/ong/economia.jpeg",
              },
              {
                title: "Apoyo Psicosocial",
                desc: "Ofrecemos acompañamiento emocional, grupos de contención y talleres de salud mental.",
                img: "/ong/apoyo.jpg",
              },
              {
                title: "Emprendimientos",
                desc: "Capacitamos y otorgamos microcréditos a emprendedores locales para fortalecer la economía social.",
                img: "/ong/emprendimiento.jpeg",
              },
              {
                title: "Protección Ambiental",
                desc: "Organizamos limpiezas de ríos, reforestación y campañas educativas para cuidar el entorno.",
                img: "/ong/proteccion.webp",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={`Proyecto: ${p.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Impacto en números
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 sm:mt-10">
            {[
              { num: "500+", label: "Niños beneficiados" },
              { num: "120", label: "Voluntarios activos" },
              { num: "30", label: "Proyectos completados" },
              { num: "15", label: "Comunidades impactadas" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {item.num}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voluntario */}
      <section id="voluntario" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Hazte voluntario
          </h2>
          <p className="text-center text-gray-600 max-w-xs sm:max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Únete a nuestra red de voluntarios y transforma vidas mientras
            creces personal y profesionalmente.
          </p>
          <div className="bg-green-50 p-6 sm:p-8 rounded-lg max-w-xs sm:max-w-4xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Beneficios del voluntariado:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 text-sm sm:text-base">
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
                className="bg-green-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base"
              >
                Quiero ser voluntario
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Donaciones */}
      <section id="donaciones" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Tu ayuda cambia vidas
          </h2>
          <p className="text-center text-gray-600 max-w-xs sm:max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Colaborá con donaciones económicas o en especie. Cada aporte suma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6">
                Doná ahora
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="https://www.mercadopago.com.ar/donar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 text-white text-center py-2.5 px-6 sm:py-3 sm:px-6 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Donar con MercadoPago
                </a>
                <a
                  href="https://www.paypal.com/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-black text-white text-center py-2.5 px-6 sm:py-3 sm:px-6 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
                >
                  Donar con PayPal
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6">
                Transferencia bancaria
              </h3>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <p className="mb-2 text-sm sm:text-base">
                  <strong>Cuenta:</strong> xxxx-xxxxxx/xx
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  <strong>Alias:</strong> ONG.DONAR.AHORA
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  <strong>Banco:</strong> BROU
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  <strong>Nombre:</strong> ONG Innovación Social
                </p>
                <p className="mt-4 text-xs sm:text-sm text-gray-500">
                  Enviá el comprobante a:{" "}
                  <a href="mailto:donaciones@ong.org" className="text-blue-600">
                    donaciones@innovacionsocial.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                ONG Innovacion Social
              </h3>
              <p className="text-sm sm:text-base">
                Trabajamos por un futuro más justo, sostenible y educado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-sm">
                <a href="mailto:contacto@ong.org">
                  contacto@innovacionsocial.org
                </a>
              </p>
              <p className="text-sm">+598 91 123-456</p>
              <p className="text-sm">Montevideo, Uruguay</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex justify-center md:justify-start space-x-6 mt-2">
                <a href="#" className="hover:text-yellow-400 text-sm">
                  Facebook
                </a>
                <a href="#" className="hover:text-yellow-400 text-sm">
                  Instagram
                </a>
                <a href="#" className="hover:text-yellow-400 text-sm">
                  YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs sm:text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ONG Innovacion Social. Todos los
            derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
