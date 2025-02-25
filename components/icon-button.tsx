import { JSX } from "react";

export default function IconButton({
  text,
  icon,
  onClick,
  disabled,
  styleClass,
  disabledStyle,
}: {
  text: string;
  icon: JSX.Element | null;
  onClick: () => void;
  disabled: boolean;
  styleClass: string;
  disabledStyle: string;
}) {
  return (
    <button
      className={
        (disabled ? disabledStyle : styleClass + " hover:cursor-pointer") +
        " py-2 px-3 rounded-sm"
      }
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="text-sm gap-2 flex items-center">
        {icon}
        {text != "" && <b>{text}</b>}
      </div>
    </button>
  );
}
