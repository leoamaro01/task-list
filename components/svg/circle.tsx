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
    <circle cx={12} cy={12} r={10} />
  </svg>
);
export default SvgComponent;
