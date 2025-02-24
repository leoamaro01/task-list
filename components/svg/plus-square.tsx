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
    <rect height={18} rx={2} ry={2} width={18} x={3} y={3} />
    <line x1={12} x2={12} y1={8} y2={16} />
    <line x1={8} x2={16} y1={12} y2={12} />
  </svg>
);
export default SvgComponent;
