import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 70, color = "#3B82F6" }) => {
  const style = {
    width: size,
    height: size,
    borderColor: `${color}40`,
    borderTopColor: color,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full border-4" style={style} />
    </div>
  );
};

export default Spinner;