# Task List

This is a front-end source code of the Task List app for the cuban.engineer technical test.

Download the back-end server from [here](https://www.github.com/leoamaro01/task-list-backend)
to be able to use this app. It will not work if the back-end is not running.

It was made using Next.js with TailwindCSS for styling. Back-end queries were done using TanStack's React Query.

To run the front-end, you must first run:

```bash
npm install
```

To install the required dependencies (this might take a while), and athen

```bash
npm run build
```

To make Next.js create an optimized build of the site, and then:

```bash
npm start
```

To actually start the server.

You can then visit it at http://localhost:3000

# Testing

You can run:

```bash
npm test
```

To automatically run all tests headlessly with Cypress (component and e2e, both with mobile variants for each test).

If you want to check out the tests and run them manually, you can use:

```bash
npx cypress open
```

Which will open the Cypress UI.

# Dependencies

The project depends on Node.js v22.14.0 and npm v10.9.2, which are the latest LTS releases at the time of writing.
