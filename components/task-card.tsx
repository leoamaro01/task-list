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

    const defaultSanitized = sanitizeHtml(defaultTaskText.current, {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (
      // Text was empty and now isn't
      (prev.trim() == "" && cleanTaskText.current.trim() != "") ||
      // Text wasn't empty and now is
      (prev.trim() != "" && cleanTaskText.current.trim() == "") ||
      // Text matched the default text and is now modified
      (prev.trim() == defaultSanitized.trim() &&
        cleanTaskText.current.trim() != defaultSanitized.trim()) ||
      // Text was modified and now matches the default text
      (prev.trim() != defaultSanitized.trim() &&
        cleanTaskText.current.trim() == defaultSanitized.trim())
    )
      setDisplayedTaskText(processTags(cleanTaskText.current));
  };

  const handleTextAreaBlur = () => {
    setDisplayedTaskText(processTags(cleanTaskText.current));
  };
  //#endregion

  const handleSubmit = () => {
    if (!open) return;

    handleTextAreaBlur();

    if (
      displayedTaskText.trim() != "" &&
      displayedTaskText.trim() != defaultTaskText.current
    )
      handleSave();
  };

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
        data-cy="task-checkbox"
        type="checkbox"
        checked={taskChecked}
        // so clicking the toggle doesn't open the task
        onClick={(ev) => {
          ev.stopPropagation();
        }}
        onChange={() => {
          onTaskToggled(taskId, !taskChecked);
        }}
        className="size-6 mx-2"
      />
      <ContentEditable
        data-cy="text-area"
        html={displayedTaskText}
        onChange={(e) => handleTextAreaChange(e.target.value)}
        onBlur={handleTextAreaBlur}
        className={
          (!open ? "hover:cursor-pointer " : "") +
          "size-full border-none border-0 focus:outline-none resize-none"
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key == "Enter") {
            e.preventDefault();

            if (!e.shiftKey) handleSubmit();
          } else if (e.key == "Escape") {
            e.preventDefault();
            handleCancel();
          }
        }}
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
      <IconButton
        dataCy="delete-button"
        icon={<TrashIcon />}
        text={isMobile ? "" : "Delete"}
        styleClass={
          (isMobile ? "" : "outline-1 ") +
          "outline-current-color text-red-400 active:text-gray-200 transition-colors"
        }
        onClick={() => onDelete(taskId)}
      />
      {isMobile ? (
        displayedTaskText.trim() == "" ? (
          <IconButton
            icon={<XIcon />}
            text=""
            styleClass="ml-auto bg-red-400 active:bg-gray-100 active:text-white transition-colors"
            onClick={() => onDelete(taskId)}
          />
        ) : displayedTaskText.trim() != defaultTaskText.current.trim() ? (
          <IconButton
            dataCy="save-button"
            icon={<SaveIcon />}
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
          {/* This Ok button thing was not in the technical test instructions but it works like that on alldone.app */}
          {displayedTaskText.trim() == "" ? (
            <IconButton
              text="Ok"
              styleClass="bg-red-400 active:bg-gray-100 active:text-white transition-colors"
              onClick={() => onDelete(taskId)}
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
      data-cy="task-card"
      ref={ref}
      className={
        (open ? "border-gray-200 shadow-sm mb-4" : "border-transparent") +
        " border rounded-s"
      }
    >
      <div className="p-1.5 pb-6">{taskInput}</div>
      {open && (
        <div
          data-cy="actions-bar"
          className="bg-gray-50 p-1.5 border-transparent border-t-gray-200 border"
        >
          {actions}
        </div>
      )}
    </div>
  );
}
