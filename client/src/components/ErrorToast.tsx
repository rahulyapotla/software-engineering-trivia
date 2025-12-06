import { CircleX } from "lucide-react";
import { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function ErrorToast({
  message,
  show,
  onClose,
  duration = 4000,
}: ErrorToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-2 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg animate-toast">
      <span>{message}</span>

      <button
        onClick={onClose}
        className="ml-1 text-white hover:text-gray-200"
        aria-label="Dismiss error message"
      >
        <CircleX className="w-4 h-4"/>      
      </button>
    </div>
  );
}
