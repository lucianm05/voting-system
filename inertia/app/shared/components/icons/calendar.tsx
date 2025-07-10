import type { SVGProps } from 'react'
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="calendar_svg__lucide calendar_svg__lucide-calendar-icon calendar_svg__lucide-calendar"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 2v4M16 2v4" />
    <rect width={18} height={18} x={3} y={4} rx={2} />
    <path d="M3 10h18" />
  </svg>
)
export default SvgCalendar
