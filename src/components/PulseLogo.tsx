export function PulseLogo({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="6" fill="white" />
      <path
        d="M14 34V14L24 24L34 14V34L24 24L14 34Z"
        fill="#0a0a0a"
      />
      <circle cx="24" cy="24" r="4" fill="white" />
    </svg>
  );
}