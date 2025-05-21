import type { SVGProps } from 'react'
const SvgVote = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="vote_svg__lucide vote_svg__lucide-vote-icon vote_svg__lucide-vote"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m9 12 2 2 4-4" />
    <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5zM22 19H2" />
  </svg>
)
export default SvgVote
