export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Conocimiento que construye futuros
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
          Formamos líderes para un mundo en constante evolución
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
            Conocé nuestros programas
          </button>
          <button className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-700 transition">
            Agendá una llamada
          </button>
        </div>
      </section>

      {/* Filosofía y propuesta */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Donde la sabiduría se convierte en estrategia
        </h2>
        <p className="text-lg text-center mb-12">
          En Atenea College formamos ciudadanos para el mundo, con herramientas
          para el desarrollo profesional y socioemocional.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">Aprender haciendo</h3>
            <p>
              Metodología práctica basada en proyectos reales y simuladores.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">Flexibilidad total</h3>
            <p>
              Modalidades 100% online, híbridas o presenciales adaptadas a tu
              vida.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">Programa de Mentores</h3>
            <p>
              Accedé a líderes consolidados y acelerá tu crecimiento
              profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Escuelas */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Escuelas y Programas
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Negocios e Inversión</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Agente Inmobiliario</li>
              <li>Asesor de Seguros</li>
              <li>Inversiones Inteligentes</li>
              <li>Emprendedurismo</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Gestión y Operaciones</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Facturación Electrónica</li>
              <li>Marketing y Ventas</li>
              <li>Gestión de Equipos</li>
              <li>Negociación</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Expansión y Franquicias</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Desarrollo de Franquicias</li>
              <li>Escalamiento de Negocios</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-indigo-900 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          El futuro no se espera, se construye
        </h2>
        <p className="mb-6">Empecemos a construir el tuyo juntos</p>
        <p className="mb-2">📧 bedelia@ateneacollege.com</p>
        <p className="mb-2">📱 098 119 414</p>
        <a href="http://ateneacollege.com" className="underline">
          ateneacollege.com
        </a>
      </section>
    </main>
  );
}
