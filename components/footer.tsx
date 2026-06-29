export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <h3 className="font-bold text-lg">
              Hands-On Physiotherapy
            </h3>
            <p className="text-sm text-gray-600 mt-3">
              One-on-one physiotherapy focused on hands-on treatment,
              recovery, and long-term results.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/booking">Book Appointment</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Surrey, British Columbia</p>
              <p>Phone: (604) XXX-XXXX</p>
              <p>Email: info@handsonphysio.ca</p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Hands-On Physiotherapy. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
