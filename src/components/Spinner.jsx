import React from "react";

function Spinner({ size = "w-6 h-6", color = "border-white" }) {
  return (
    <div
      className={`${size} border-4 ${color} border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}

export default Spinner;
