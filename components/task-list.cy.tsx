import TaskList from "./task-list";

import "../cypress/support/component";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

import { Task } from "../types/task";

describe("<TaskList /> with no tasks", () => {
  it("should render the NewTask component and no task cards", () => {
    cy.mount(
      <TaskList
        onAddTask={() => {}}
        onTaskDelete={() => {}}
        onTaskToggle={() => {}}
        onTaskUpdate={() => {}}
        tasks={[]}
      />
    );

    cy.get("[data-cy=new-task]").should("have.length", 1);
    cy.get("[data-cy=task-card]").should("have.length", 0);
  });
});

describe("<TaskList /> with tasks", () => {
  it("should render the NewTask component and one task card for each specified task", () => {
    cy.mount(
      <TaskList
        onAddTask={() => {}}
        onTaskDelete={() => {}}
        onTaskToggle={() => {}}
        onTaskUpdate={() => {}}
        tasks={[
          new Task(1, "Task text!", true),
          new Task(2, "Task text 2!", false),
          new Task(3, "Task text! 3", false),
          new Task(5, "5 Task text!", true),
        ]}
      />
    );

    cy.get("[data-cy=new-task]").should("have.length", 1);
    cy.get("[data-cy=task-card]").should("have.length", 4);
  });
});

export {};
