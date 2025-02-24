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
    <rect height={18} rx={2} ry={2} width={18} x={3} y={4} />
    <line x1={16} x2={16} y1={2} y2={6} />
    <line x1={8} x2={8} y1={2} y2={6} />
    <line x1={3} x2={21} y1={10} y2={10} />
  </svg>
);
export default SvgComponent;
