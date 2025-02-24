import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";

import { useOutsideClick } from "../hooks/use-outside-click";
import IconButton from "./icon-button";
import CalendarIcon from "./svg/calendar";
import CircleIcon from "./svg/circle";
import LoaderIcon from "./svg/loader";
import MaximizeIcon from "./svg/maximize-2";
import SaveIcon from "./svg/save";
import TrashIcon from "./svg/trash";
import UnlockIcon from "./svg/unlock";
import XIcon from "./svg/x";

export default function TaskCard({
  taskId,
  taskText,
  taskChecked,
  onTaskToggled,
  onDelete,
  onSave,
}: {
  taskId: number;
  taskText: string;
  taskChecked: boolean;
  onTaskToggled: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
  onSave: (id: number, newText: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // #region Tags and regex
  const atRegex = new RegExp(" @[^ ]+", "g");
  const hashtagRegex = new RegExp(" #[^ ]+", "g");
  const linkRegex = new RegExp(
    " (?:http(?:s)?://)?(?:(?:[0-9]+[a-zA-Z]+[a-zA-Z0-9_-]*)|(?:[a-zA-Z]+[a-zA-Z0-9_-]*))(?:\\.(?:(?:[0-9]+[a-zA-Z]+[a-zA-Z0-9_-]*)|(?:[a-zA-Z]+[a-zA-Z0-9_-]*)))+(?:/[?#=&+a-zA-Z0-9_.-]+)*/?",
    "g"
  );
  const emailRegex = new RegExp(
    " [a-zA-Z0-9._%+-]+@[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)+",
    "g"
  );

  const processTags = (text: string) => {
    let value = text;

    value = value.replaceAll(
      atRegex,
      (str) =>
        ' <button onclick="event.stopPropagation()" style="color: oklch(0.448 0.119 151.328); background-color: oklch(0.871 0.15 154.449); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
        str.substring(1) +
        "</button>"
    );
    value = value.replaceAll(
      linkRegex,
      (str) =>
        " <button onclick=\"event.stopPropagation();window.open('" +
        (!str.startsWith("https://") && !str.startsWith("http://")
          ? "https://"
          : "") +
        str.substring(1) +
        "', '_blank');\" style=\"color: oklch(0.488 0.243 264.376); background-color: oklch(0.809 0.105 251.813); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;\">" +
        str.substring(1) +
        "</button>"
    );
    value = value.replaceAll(
      hashtagRegex,
      (str) =>
        ' <button onclick="event.stopPropagation()" style="color: oklch(0.432 0.232 292.759); background-color: oklch(0.811 0.111 293.571); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
        str.substring(1) +
        "</button>"
    );
    value = value.replaceAll(
      emailRegex,
      (str) =>
        ' <button onclick="event.stopPropagation()" style="color: oklch(0.705 0.213 47.604); background-color: oklch(0.901 0.076 70.697); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
        str.substring(1) +
        "</button>"
    );

    if (!value.endsWith(" ") && value != "") value += " ";

    return value;
  };
  // #endregion

  const defaultTaskText = useRef(taskText);

  useEffect(() => {
    defaultTaskText.current = taskText;
  }, [taskText]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1230);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1230);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [checked, setChecked] = useState(taskChecked);

  const [displayedTaskText, setDisplayedTaskText] = useState(
    processTags(taskText)
  );
  const cleanTaskText = useRef(taskText);

  //#region Separation of display text and clean text
  // This was done because updating the display text immediately
  // when edited it would cause the cursor the go to the end
  // of the rect
  const handleTextAreaChange = (text: string) => {
    const prev = cleanTaskText.current;
    cleanTaskText.current = sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (prev.trim() == "" && cleanTaskText.current.trim() != "")
      setDisplayedTaskText(processTags(cleanTaskText.current));
    else if (cleanTaskText.current.trim() == "")
      setDisplayedTaskText(cleanTaskText.current);
  };

  const handleTextAreaBlur = () => {
    setDisplayedTaskText(processTags(cleanTaskText.current));
  };
  //#endregion

  useEffect(() => {
    setChecked(taskChecked);
  }, [taskChecked]);

  const handleSave = () => {
    onSave(taskId, cleanTaskText.current);
    setOpen(false);
  };

  const handleCancel = () => {
    cleanTaskText.current = defaultTaskText.current;
    setOpen(false);
    setDisplayedTaskText(processTags(defaultTaskText.current));
  };

  const ref = useOutsideClick(handleCancel);

  const handleOnInputClick = () => {
    setOpen(true);
  };

  const taskInput = (
    <div onClick={open ? undefined : handleOnInputClick} className="flex gap-2">
      <input
        type="checkbox"
        checked={checked}
        // so clicking the toggle doesn't open the task
        onClick={(ev) => {
          ev.stopPropagation();
        }}
        onChange={() => {
          onTaskToggled(taskId, !checked);
          setChecked((c) => !c);
        }}
        className="size-6 mx-2"
      />
      <ContentEditable
        html={displayedTaskText}
        onChange={(e) => handleTextAreaChange(e.target.value)}
        onBlur={handleTextAreaBlur}
        className={
          (!open ? "hover:cursor-pointer " : "") +
          "size-full border-none border-0 focus:outline-none resize-none"
        }
        aria-placeholder={"Write the name of the task"}
      />
      {open && (
        <Image
          src="/profile.png"
          alt="Profile"
          width={10}
          height={10}
          className={
            (displayedTaskText.trim() == ""
              ? "opacity-50 transition-opacity "
              : "") + "size-5 rounded-full transition-opacity"
          }
        />
      )}
    </div>
  );

  const actions = (
    <div className="flex p-0.5 gap-1.5">
      <IconButton
        icon={<MaximizeIcon />}
        text={isMobile ? "" : "Open"}
        styleClass={
          (isMobile ? "" : "mr-8 ") +
          "bg-gray-300 text-gray-800 active:bg-gray-100 active:text-gray-300 transition-colors"
        }
        disabled={false}
        disabledStyle={(isMobile ? "" : "mr-8 ") + "bg-gray-200 text-gray-400"}
        onClick={() => {}}
        isSubmit={false}
        isReset={false}
      />
      <IconButton
        icon={<CalendarIcon />}
        text={isMobile ? "" : "Today"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-400 active:text-gray-200 transition-colors"
        }
        disabled={displayedTaskText.trim() == ""}
        disabledStyle={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-300 transition-colors"
        }
        onClick={() => {}}
        isSubmit={false}
        isReset={false}
      />
      <IconButton
        icon={<UnlockIcon />}
        text={isMobile ? "" : "Public"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-400 active:text-gray-200 transition-colors"
        }
        disabled={displayedTaskText.trim() == ""}
        disabledStyle={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-300 transition-colors"
        }
        onClick={() => {}}
        isSubmit={false}
        isReset={false}
      />
      <IconButton
        icon={<LoaderIcon />}
        text={isMobile ? "" : "Normal"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-400 active:text-gray-200 transition-colors"
        }
        disabled={displayedTaskText.trim() == ""}
        disabledStyle={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-300 transition-colors"
        }
        onClick={() => {}}
        isSubmit={false}
        isReset={false}
      />
      <IconButton
        icon={
          <div className="relative text-inherit items-center">
            <CircleIcon />
            <div className="absolute bottom-0 w-full h-5/6 text-inherit text-xs">
              0
            </div>
          </div>
        }
        text={isMobile ? "" : "Estimation"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-400 active:text-gray-200 transition-colors"
        }
        disabled={displayedTaskText.trim() == ""}
        disabledStyle={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-gray-300 transition-colors"
        }
        onClick={() => {}}
        isSubmit={false}
        isReset={false}
      />
      <IconButton
        icon={<TrashIcon />}
        text={isMobile ? "" : "Delete"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-red-400 active:text-gray-200 transition-colors"
        }
        onClick={() => onDelete(taskId)}
        disabled={false}
        disabledStyle=""
        isSubmit={false}
        isReset={false}
      />
      {isMobile ? (
        displayedTaskText.trim() == "" ? (
          <IconButton
            icon={<XIcon />}
            text=""
            styleClass="ml-auto bg-red-400 active:bg-gray-100 active:text-white transition-colors"
            onClick={() => onDelete(taskId)}
            disabled={false}
            disabledStyle=""
            isSubmit={false}
            isReset={false}
          />
        ) : displayedTaskText.trim() != defaultTaskText.current.trim() ? (
          <IconButton
            icon={<SaveIcon />}
            text=""
            styleClass="ml-auto bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
            onClick={handleSave}
            disabled={false}
            disabledStyle=""
            isSubmit={true}
            isReset={false}
          />
        ) : (
          <IconButton
            icon={<XIcon />}
            text=""
            styleClass="ml-auto bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
            onClick={handleCancel}
            disabled={false}
            disabledStyle=""
            isSubmit={false}
            isReset={true}
          />
        )
      ) : (
        <>
          <IconButton
            icon={null}
            text="Cancel"
            styleClass="ml-auto text-gray-800 bg-gray-200 active:text-gray-300 active:bg-gray-100 transition-colors"
            onClick={handleCancel}
            disabled={false}
            disabledStyle=""
            isSubmit={false}
            isReset={true}
          />
          {/* This Ok button thing was not in the technical test instructions but it works like that on alldone.app */}
          {displayedTaskText.trim() == "" ? (
            <IconButton
              icon={null}
              text="Ok"
              styleClass="bg-red-400 active:bg-gray-100 active:text-white transition-colors"
              onClick={() => onDelete(taskId)}
              disabled={false}
              disabledStyle=""
              isSubmit={false}
              isReset={false}
            />
          ) : (
            <IconButton
              icon={null}
              text="Save"
              styleClass="bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
              onClick={handleSave}
              disabled={false}
              disabledStyle=""
              isSubmit={true}
              isReset={false}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <form method="" onReset={handleCancel} onSubmit={handleSave}>
      <div
        ref={ref}
        className={
          (open ? "border-gray-200 shadow-sm mb-4" : "border-transparent") +
          " border rounded-s"
        }
      >
        <div className="p-1.5 pb-6">{taskInput}</div>
        {open && (
          <div className="bg-gray-50 p-1.5 border-transparent border-t-gray-200 border">
            {actions}
          </div>
        )}
      </div>
    </form>
  );
}
