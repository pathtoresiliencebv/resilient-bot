import { FC } from "react"

interface TogetherSVGProps {
  height?: number
  width?: number
  className?: string
}

export const TogetherSVG: FC<TogetherSVGProps> = ({
  height = 40,
  width = 40,
  className
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <rect
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 10h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      <circle cx="24" cy="16" r="2" fill="currentColor" />
      <circle cx="20" cy="24" r="2" fill="currentColor" />
      <path
        d="M16 18c1.3 1.3 2.7 1.3 4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
