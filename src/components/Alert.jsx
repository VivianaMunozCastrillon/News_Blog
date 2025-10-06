import React, { useEffect, useState } from "react";

function Alert({ message, type = "info", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message || !visible) return null;

  const baseStyles =
    "p-4 rounded-2xl shadow-md text-center transition-opacity duration-500";

  const typeStyles = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type] || typeStyles.info}`}>
      {message}
    </div>
  );
}

export default Alert;
