import type { SVGProps } from 'react'
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="plus_svg__lucide plus_svg__lucide-plus-icon plus_svg__lucide-plus"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
)
export default SvgPlus
