import type { SVGProps } from 'react'
const SvgPencil = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="pencil_svg__lucide pencil_svg__lucide-pencil-icon pencil_svg__lucide-pencil"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4" />
  </svg>
)
export default SvgPencil
