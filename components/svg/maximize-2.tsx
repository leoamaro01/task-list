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
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1={21} x2={14} y1={3} y2={10} />
    <line x1={3} x2={10} y1={21} y2={14} />
  </svg>
);
export default SvgComponent;
