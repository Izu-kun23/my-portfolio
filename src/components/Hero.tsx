import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import profileImg from "../assets/profile.png";
import Button from "./ui/Button";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useEffect, useRef } from "react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const izuchukwuX = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ["0vw", "8vw", "8vw"],
  );
  const tonyX = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ["0vw", "-10vw", "-10vw"],
  );

  return (
    <section
      ref={heroRef}
      id="home"
      aria-labelledby="hero-title"
      className={`relative bg-[#a7a5a5] text-white ${
        prefersReducedMotion ? "min-h-[100dvh]" : "h-[170dvh]"
      }`}
    >
      <div
        className={`top-0 min-h-[100dvh] overflow-hidden ${
          prefersReducedMotion ? "relative" : "sticky"
        }`}
      >
        <motion.img
          src={profileImg}
          alt=""
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 size-full object-contain object-center grayscale md:object-cover md:object-[62%_center]"
        />

        <div className="absolute inset-0 bg-[#5f5d5d]/38" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(54,52,52,0.34)_0%,rgba(77,75,75,0.16)_52%,rgba(30,29,29,0.04)_100%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
          className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1600px] grid-cols-[3.75rem_minmax(0,1fr)] content-center px-5 py-24 sm:grid-cols-[5.25rem_minmax(0,1fr)] sm:px-8 md:grid-cols-[6.5rem_minmax(0,1fr)] md:px-12 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:px-16 xl:grid-cols-[8.5rem_minmax(0,1fr)] xl:px-20"
        >
        <motion.h1
          id="hero-title"
          variants={reveal}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative col-span-2 min-h-[6.25rem] w-full font-[Arial,Helvetica,sans-serif] text-[clamp(2.3rem,6vw,5.75rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] sm:min-h-[8rem] md:min-h-[10rem] lg:min-h-[12rem]"
        >
          <span className="block translate-y-7 sm:translate-y-8 md:translate-y-9">
            <motion.span
              className="inline-block will-change-transform"
              style={{ x: prefersReducedMotion ? 0 : izuchukwuX }}
            >
              IZUCHUKWU
            </motion.span>
          </span>
          <span className="absolute bottom-0 right-[2vw] translate-y-11 sm:translate-y-13 lg:translate-y-15">
            <motion.span
              className="inline-block will-change-transform"
              style={{ x: prefersReducedMotion ? 0 : tonyX }}
            >
              TONY
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          variants={reveal}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="col-start-1 mt-10 h-px w-12 -translate-y-5 self-start bg-white/90 sm:mt-12 sm:w-16 sm:-translate-y-6 md:w-20 lg:w-24 lg:-translate-y-8"
          aria-hidden="true"
        />

        <motion.p
          variants={reveal}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="col-start-2 mt-7 max-w-[16ch] -translate-y-5 font-[Arial,Helvetica,sans-serif] text-[clamp(1.7rem,3.4vw,3.75rem)] font-light italic leading-[0.98] tracking-[-0.05em] sm:mt-9 sm:-translate-y-6 lg:-translate-y-8"
        >
          Web Developer &amp; Tech Entrepreneur.
        </motion.p>

        <motion.p
          variants={reveal}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="col-start-2 mt-8 max-w-[48ch] -translate-y-5 text-[0.65rem] font-semibold uppercase leading-[1.8] tracking-[0.24em] text-white/78 sm:-translate-y-6 sm:text-xs md:mt-10 md:text-sm lg:-translate-y-8"
        >
          I launch from code, delivering tech that matters.
        </motion.p>
        </motion.div>

        <div className="absolute bottom-8 right-8 z-20">
          <Button href="#projects">View Work</Button>
        </div>
      </div>
    </section>
  );
}
