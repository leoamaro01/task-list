import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    // eslint-disable-next-line no-undef
    .map((f) => relative(process.cwd(), f))
    .join(" --file ")}`;

const prettierCommand = "prettier --write";

export default {
  "*.{js,jsx,ts,tsx}": [prettierCommand, buildEslintCommand],
  "*.{json,css,md}": [prettierCommand],
};
