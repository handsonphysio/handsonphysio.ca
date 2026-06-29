export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-white/70 backdrop-blur border-b z-50">
      <div className="max-w-6xl mx-auto flex justify-between px-5 py-3">

        <a href="/" className="font-bold">
          Hands-On Physiotherapy
        </a>

        <nav className="hidden md:flex gap-6 text-sm">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>

        <a
          href="/booking"
          className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Book Now
        </a>

      </div>
    </header>
  );
}
