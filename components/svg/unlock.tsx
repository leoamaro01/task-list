import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    className="main-grid-item-icon"
    data-darkreader-inline-stroke=""
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
  >
    <rect height={11} rx={2} ry={2} width={18} x={3} y={11} />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);
export default SvgComponent;
