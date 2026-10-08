import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast = ({ message }: ToastProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#141724] border border-primary/40 text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3 backdrop-blur-xl"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
