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

export const processTags = (text: string) => {
  let value = " " + text;

  value = value.replaceAll(
    atRegex,
    (str) =>
      ' <button type="button" onclick="event.stopPropagation()" style="color: oklch(0.448 0.119 151.328); background-color: oklch(0.871 0.15 154.449); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
      str.substring(1) +
      "</button>"
  );
  value = value.replaceAll(
    linkRegex,
    (str) =>
      ' <button type="button" onclick="event.stopPropagation();window.open(\'' +
      (!str.startsWith("https://") && !str.startsWith("http://")
        ? "https://"
        : "") +
      str.substring(1) +
      "', '_blank');\" style=\"align-items:center; gap: 0.2rem; display:inline-flex; color: oklch(0.488 0.243 264.376); background-color: oklch(0.809 0.105 251.813); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;\">" +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>' +
      str.substring(1) +
      "</button>"
  );
  value = value.replaceAll(
    hashtagRegex,
    (str) =>
      ' <button type="button" onclick="event.stopPropagation()" style="color: oklch(0.432 0.232 292.759); background-color: oklch(0.811 0.111 293.571); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
      str.substring(1) +
      "</button>"
  );
  value = value.replaceAll(
    emailRegex,
    (str) =>
      ' <button type="button" onclick="event.stopPropagation()" style="align-items:center; gap: 0.2rem; display:inline-flex; color: oklch(0.705 0.213 47.604); background-color: oklch(0.901 0.076 70.697); border-radius: calc(infinity * 1px); padding-inline: 0.5rem;">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"> <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>' +
      str.substring(1) +
      "</button>"
  );

  value = value.slice(1);

  if (!value.endsWith(" ") && value != "") value += " ";

  return value;
};
