import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass w-full max-w-2xl rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button className="btn-secondary !p-3" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
