export default function Home() {
  return (
    <main className="bg-white text-gray-900">

      {/* TOP NAV */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">

          {/* LOGO */}
          <a href="/" className="font-bold text-lg tracking-tight">
            Hands-On Physiotherapy
          </a>

          {/* NAV LINKS */}
          <nav className="hidden md:flex gap-6 text-sm text-gray-700">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#insurance">Insurance</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* CTA */}
          <a
            href="#booking"
            className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm hover:bg-teal-700 transition"
          >
            Book Now
          </a>

        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 text-center bg-gradient-to-b from-gray-50 to-white">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          One-on-One Physiotherapy
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Every session. Fully dedicated to you.
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Hands-On Physiotherapy delivers personalized, evidence-based care with a licensed physiotherapist — no assistants, no rushed sessions, just focused recovery.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="#booking"
            className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition"
          >
            Book Appointment
          </a>

          <a
            href="#services"
            className="border border-gray-300 px-6 py-3 rounded-full hover:border-gray-500 transition"
          >
            Explore Services
          </a>
        </div>

        {/* TRUST LINE */}
        <div className="mt-10 text-sm text-gray-500">
          ✔ Direct Billing Available &nbsp; | &nbsp; ✔ ICBC Accepted &nbsp; | &nbsp; ✔ One-on-One Care
        </div>

      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center">
            Our Services
          </h2>

          <p className="text-center text-gray-600 mt-3">
            Comprehensive rehabilitation tailored to your recovery goals
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            {[
              "Musculoskeletal Assessment",
              "Manual Therapy",
              "Sports Injury Rehab",
              "ICBC Rehabilitation",
              "Post-Surgical Rehab",
              "Chronic Pain Management"
            ].map((item) => (
              <div
                key={item}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold">{item}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Personalized treatment plan focused on mobility, strength, and recovery.
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold">
            Why One-on-One Matters
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Unlike high-volume clinics, every appointment at Hands-On Physiotherapy is dedicated solely to you.
            This allows deeper assessment, more effective manual therapy, and faster recovery outcomes through focused care.
          </p>

        </div>
      </section>

      {/* INSURANCE */}
      <section id="insurance" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold">
            Direct Billing Available
          </h2>

          <p className="text-gray-600 mt-3">
            We work with most major extended health insurance providers
          </p>

          {/* SIMPLE LOGO PLACEHOLDERS */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400 text-sm">
            <div className="border p-4 rounded">Canada Life</div>
            <div className="border p-4 rounded">Sun Life</div>
            <div className="border p-4 rounded">Manulife</div>
            <div className="border p-4 rounded">Blue Cross</div>
          </div>

        </div>
      </section>

      {/* BOOKING CTA */}
      <section id="booking" className="py-24 px-6 bg-teal-600 text-white text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          Start Your Recovery Today
        </h2>

        <p className="mt-4 text-white/80">
          Book your one-on-one physiotherapy session in minutes
        </p>

        <a
          href="#"
          className="inline-block mt-8 bg-white text-teal-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Book Online
        </a>

      </section>

      {/* FOOTER */}
      <footer id="contact" className="py-10 px-6 border-t text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">Hands-On Physiotherapy</p>
        <p>Surrey, British Columbia</p>
        <p className="mt-2">© {new Date().getFullYear()} All rights reserved</p>
      </footer>

    </main>
  );
}
