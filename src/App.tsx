import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <div className="bg-white text-gray-900">

      <Navbar />
      <Hero />

      <section id="about" className="flex min-h-[100dvh] scroll-mt-18 items-center justify-center border-t border-gray-100">
        <h2 className="text-gray-500">About Section</h2>
      </section>

      <section id="projects" className="flex min-h-[100dvh] scroll-mt-18 items-center justify-center border-t border-gray-100">
        <h2 className="text-gray-500">Projects Section</h2>
      </section>

      <section id="contact" className="flex min-h-[100dvh] scroll-mt-18 items-center justify-center border-t border-gray-100">
        <h2 className="text-gray-500">Contact Section</h2>
      </section>

    </div>
  );
}
