import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-[#1e1f22] rounded-md border border-neutral-800/50 ${className}`}>
      {children}
    </div>
  );
}