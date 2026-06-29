import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <main className="pt-24">

      {/* HERO */}
      <section className="text-center px-6 py-20 bg-gray-50">
        <h1 className="text-5xl font-bold">
          One-on-One Physiotherapy
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Every session fully dedicated to your recovery
        </p>

        <a className="mt-8 inline-block bg-teal-600 text-white px-6 py-3 rounded-full">
          Book Appointment
        </a>
      </section>

      {/* INSURANCE STRIP */}
      <section className="py-16 overflow-hidden">
        <div className="animate-scroll flex gap-12 text-gray-400 text-sm">
          {[
            "Sun Life",
            "Manulife",
            "Canada Life",
            "Blue Cross",
            "Green Shield"
          ].map((i, idx) => (
            <span key={idx}>{i}</span>
          ))}
        </div>
      </section>

      <FloatingActions />

    </main>
  );
}
