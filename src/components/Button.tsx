import React, { ButtonHTMLAttributes } from "react";

interface PrimaryProps {
  disabled?: boolean;
  label: string;
  onClick: (value: React.MouseEvent) => void;
}

export function PrimaryButton({
  disabled = false,
  label,
  onClick,
}: PrimaryProps) {
  return (
    <button
      className="mx-auto w-full h-12 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
