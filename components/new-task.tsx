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
import PlusIcon from "./svg/plus";
import PlusSquare from "./svg/plus-square";
import UnlockIcon from "./svg/unlock";
import XIcon from "./svg/x";

export default function TaskCard({
  onAddTask,
}: {
  onAddTask: (text: string) => void;
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

  useEffect(() => {
    setIsMobile(window.innerWidth < 1230);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1230);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [displayedTaskText, setDisplayedTaskText] = useState("");
  const cleanTaskText = useRef("");

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

  const handleSave = () => {
    onAddTask(cleanTaskText.current);
    cleanTaskText.current = "";
    setDisplayedTaskText("");
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setDisplayedTaskText("");
  };

  const handleClickOutside = () => {
    setOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  const handleOnInputClick = () => {
    setOpen(true);
  };

  const taskInput = (
    <div
      onClick={open ? undefined : handleOnInputClick}
      className="flex gap-4 ml-2 text-blue-500"
    >
      <PlusSquare />
      <ContentEditable
        html={open ? displayedTaskText : ""}
        onChange={(e) => handleTextAreaChange(e.target.value)}
        onBlur={handleTextAreaBlur}
        className={
          (!open ? "hover:cursor-pointer " : "") +
          "size-full border-none border-0 focus:outline-none resize-none text-black"
        }
        aria-placeholder={"Type to add a new task"}
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
        disabled={displayedTaskText.trim() == ""}
        disabledStyle={
          (isMobile ? "" : "mr-8 ") +
          "bg-gray-200 text-gray-400 transition-colors"
        }
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
      {isMobile ? (
        displayedTaskText.trim() != "" ? (
          <IconButton
            icon={<PlusIcon />}
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
          {displayedTaskText.trim() == "" ? (
            <IconButton
              icon={null}
              text="Ok"
              styleClass="bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
              onClick={handleCancel}
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
          (open ? "border-gray-200 shadow-sm mb-4 " : "border-transparent ") +
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
