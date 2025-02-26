import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";

import { useOutsideClick } from "../hooks/use-outside-click";
import { processTags } from "../utils/processTags";
import IconButton from "./icon-button";
import CalendarIcon from "./svg/calendar";
import CircleIcon from "./svg/circle";
import LoaderIcon from "./svg/loader";
import MaximizeIcon from "./svg/maximize-2";
import PlusIcon from "./svg/plus";
import PlusSquare from "./svg/plus-square";
import UnlockIcon from "./svg/unlock";
import XIcon from "./svg/x";

export default function NewTask({
  onAddTask,
}: {
  onAddTask: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

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

  const handleSubmit = () => {
    if (!open) return;

    handleTextAreaBlur();

    if (displayedTaskText.trim() != "") handleSave();
  };

  const handleSave = () => {
    onAddTask(cleanTaskText.current);
    cleanTaskText.current = "";
    setDisplayedTaskText("");
    setOpen(false);
  };

  const handleCancel = () => {
    handleTextAreaBlur();
    setOpen(false);
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
        data-cy="text-area"
        html={open ? displayedTaskText : ""}
        onChange={(e) => handleTextAreaChange(e.target.value)}
        onBlur={handleTextAreaBlur}
        className={
          (!open ? "hover:cursor-pointer " : "") +
          "size-full border-none border-0 focus:outline-none resize-none text-black"
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key == "Enter") {
            e.preventDefault();
            handleSubmit();
          } else if (e.key == "Escape") {
            e.preventDefault();
            handleCancel();
          }
        }}
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
    <div data-cy="actions-bar" className="flex p-0.5 gap-1.5">
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
      />
      {isMobile ? (
        displayedTaskText.trim() != "" ? (
          <IconButton
            dataCy="save-button"
            icon={<PlusIcon />}
            text=""
            styleClass="ml-auto bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
            onClick={handleSave}
          />
        ) : (
          <IconButton
            dataCy="cancel-button"
            icon={<XIcon />}
            text=""
            styleClass="ml-auto bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
            onClick={handleCancel}
          />
        )
      ) : (
        <>
          <IconButton
            dataCy="cancel-button"
            text="Cancel"
            styleClass="ml-auto text-gray-800 bg-gray-200 active:text-gray-300 active:bg-gray-100 transition-colors"
            onClick={handleCancel}
          />
          {displayedTaskText.trim() == "" ? (
            <IconButton
              dataCy="cancel-button"
              text="Ok"
              styleClass="bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
              onClick={handleCancel}
            />
          ) : (
            <IconButton
              dataCy="save-button"
              text="Save"
              styleClass="bg-blue-500 text-white active:text-white active:bg-gray-100 transition-colors"
              onClick={handleSave}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      data-cy="new-task"
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
  );
}
