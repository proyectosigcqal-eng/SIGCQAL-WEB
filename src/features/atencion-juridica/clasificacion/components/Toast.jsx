import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const Toast = ({ visible, type, message, onClose, durationMs = 2800 }) => {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs, onClose]);

  if (!visible) return null;

  const Icon = type === 'success' ? CheckCircle2 : XCircle;

  return (
    <div className={`aj-toast ${type === 'success' ? 'is-success' : 'is-error'}`} role="status">
      <div className="aj-toast-icon">
        <Icon size={18} />
      </div>
      <div className="aj-toast-msg">{message}</div>
      <button type="button" className="aj-toast-close" onClick={onClose} aria-label="Cerrar">
        <X size={16} />
      </button>
    </div>
  );
};

