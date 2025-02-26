import { JSX } from "react";

interface IconButtonProps {
  text?: string | undefined;
  icon?: JSX.Element | undefined;
  onClick?: () => void | undefined;
  disabled?: boolean | undefined;
  styleClass?: string | undefined;
  disabledStyle?: string | undefined;
  dataCy?: string | undefined;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <button
      data-cy={props.dataCy}
      className={
        (props.disabled
          ? (props.disabledStyle ?? "")
          : (props.styleClass ?? "") + " hover:cursor-pointer") +
        " py-2 px-3 rounded-sm text-sm gap-2 flex items-center"
      }
      onClick={props.disabled ? undefined : props.onClick}
      disabled={props.disabled}
    >
      {props.icon}
      {props.text && props.text != "" && (
        <b data-cy="button-text">{props.text}</b>
      )}
    </button>
  );
}
