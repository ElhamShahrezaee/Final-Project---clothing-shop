type IconProps = {
  className?: string;
};

const pathProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Material outlined: visibility */
export function VisibilityIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        {...pathProps}
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
      />
      <circle {...pathProps} cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Material outlined: visibility_off */
export function VisibilityOffIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...pathProps} d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path
        {...pathProps}
        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
      />
      <path
        {...pathProps}
        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
      />
      <line {...pathProps} x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
