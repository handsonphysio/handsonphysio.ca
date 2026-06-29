export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <header className="fixed top-0 w-full bg-white border-b z-50">
        <div className="max-w-6xl mx-auto flex justify-between px-4 py-3">
          <div className="font-bold">Hands-On Physiotherapy</div>

          <div className="hidden md:flex gap-6 text-sm">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <a className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm">
            Book Now
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 text-center px-6 bg-gray-50 pb-20">
        <h1 className="text-5xl font-bold">
          One-on-One Physiotherapy
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Every Session. Every Visit.
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Dedicated physiotherapy care with a licensed professional.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-teal-600 text-white px-6 py-3 rounded-full">
            Book Appointment
          </button>
          <button className="border px-6 py-3 rounded-full">
            Services
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Services</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {["Assessment", "Manual Therapy", "Sports Injury", "ICBC Rehab"].map(
            (item) => (
              <div key={item} className="border p-6 rounded-xl">
                <h3 className="font-semibold">{item}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Personalized treatment plan.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm text-gray-500">
        © Hands-On Physiotherapy
      </footer>

    </main>
  );
}
