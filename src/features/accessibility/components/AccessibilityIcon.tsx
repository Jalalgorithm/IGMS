interface AccessibilityIconProps {
  className?: string;
}

/** The standard accessibility figure — head, outstretched arms, legs. */
export const AccessibilityIcon = ({ className }: AccessibilityIconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
    <circle cx="12" cy="4.1" r="2.1" fill="currentColor" />
    <path
      d="M4.4 8.2c2.4.9 5 1.4 7.6 1.4s5.2-.5 7.6-1.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 9.6v4.7m0 0 3 7.1m-3-7.1-3 7.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
