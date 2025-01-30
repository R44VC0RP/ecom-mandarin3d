import { FC } from 'react';

interface ExonIconProps {
  size?: number;
  className?: string;
}

const ExonIcon: FC<ExonIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 283 283" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="141.5" cy="141.5" r="141.5" fill="#4D2E58"/>
      <ellipse cx="143" cy="143.521" rx="108" ry="109.521" fill="#6E417D"/>
      <ellipse cx="142" cy="143.013" rx="78" ry="79.013" fill="#824D95"/>
      <ellipse cx="140.5" cy="142" rx="50.5" ry="51" fill="#C6AAD0"/>
      <circle cx="139.5" cy="141.5" r="27.5" fill="#ECE2EF"/>
    </svg>
  );
};

export default ExonIcon;
