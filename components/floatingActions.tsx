export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">

      <a
        href="tel:+1604XXXXXXX"
        className="bg-black text-white px-4 py-3 rounded-full text-sm"
      >
        Call
      </a>

      <a
        href="/booking"
        className="bg-teal-600 text-white px-4 py-3 rounded-full text-sm"
      >
        Book
      </a>

    </div>
  );
}
