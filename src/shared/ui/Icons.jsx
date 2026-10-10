export function SproutIcon({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 12c0-4.4 3-6.6 7.5-6.5 0 4.4-3 6.6-7.5 6.5z" />
      <path d="M12 15c0-3.3-2.5-5.2-6.5-5 0 3.3 2.5 5.2 6.5 5z" />
    </svg>
  )
}