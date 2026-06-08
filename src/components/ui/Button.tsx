import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
};

export default function Button({ children, onClick, href }: ButtonProps) {
  const className =
    "px-6 py-3 border border-gray-200 bg-gray-200 text-gray-900 text-sm tracking-wide transition-all duration-300 hover:bg-black hover:text-white active:scale-95";

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}