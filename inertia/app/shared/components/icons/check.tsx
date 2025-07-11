import type { SVGProps } from 'react'
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="check_svg__lucide check_svg__lucide-check-icon check_svg__lucide-check"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
export default SvgCheck
