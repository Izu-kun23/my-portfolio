import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full px-6 md:px-8 py-5 flex justify-between items-center 
                   bg-transparent z-50"
      >
        {/* BRAND */}
        <div className="text-lg uppercase text-white font-bold">
          Izuchukwu
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm text-white/70">
          <a href="#home" className="hover:text-white transition">HOME</a>
          <a href="#projects" className="hover:text-white transition">WORK</a>
          <a href="#about" className="hover:text-white transition">ABOUT</a>
          <a href="#contact" className="hover:text-white transition">CONTACT</a>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </motion.nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] bg-[#111] z-50 flex flex-col p-10"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpen(false)}
                className="text-white text-2xl self-end mb-10"
              >
                ✕
              </button>

              {/* LINKS */}
              <div className="flex flex-col gap-8 text-white text-xl">
                <a onClick={() => setOpen(false)} href="#home">HOME</a>
                <a onClick={() => setOpen(false)} href="#projects">WORK</a>
                <a onClick={() => setOpen(false)} href="#about">ABOUT</a>
                <a onClick={() => setOpen(false)} href="#contact">CONTACT</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}