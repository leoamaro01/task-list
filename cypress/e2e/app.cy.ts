import { Task } from "../../types/task";
import { backendUrl } from "../../utils/backendUrl";

describe("Full workflow", () => {
  it("should appropiately represent all tasks, be able to add a new task, be able to edit an existing task, and be able", () => {
    const tasksStub: { items: Task[]; count: number } = {
      items: [
        {
          id: 1,
          text: "Hello World! What a great morning!",
          checked: false,
        },
        {
          id: 2,
          text: "Someone write to admin@company.org, we are getting attacked by https://www.facebook.com!",
          checked: true,
        },
        {
          id: 3,
          text: "@dev-team get on this quick!",
          checked: false,
        },
      ],
      count: 3,
    };
    let autoIncrementingId = 4;

    function addInterceptsForTask(id: number) {
      cy.intercept(
        { method: "PATCH", url: `${backendUrl}/task/${id}` },
        (req) => {
          const taskIndex = tasksStub.items.findIndex((t) => t.id == id);

          tasksStub.items[taskIndex].text =
            req.body.text ?? tasksStub.items[taskIndex].text;
          tasksStub.items[taskIndex].checked =
            req.body.checked ?? tasksStub.items[taskIndex].checked;

          req.reply(tasksStub.items[taskIndex]);
        }
      );

      cy.intercept(
        { method: "DELETE", url: `${backendUrl}/task/${id}` },
        (req) => {
          const taskIndex = tasksStub.items.findIndex((t) => t.id == id);

          tasksStub.count -= 1;

          tasksStub.items.splice(taskIndex, 1);

          req.reply({});
        }
      );
    }

    cy.intercept({ method: "GET", url: `${backendUrl}/task` }, (req) => {
      req.reply(tasksStub);
    }).as("getTasks");

    cy.intercept({ method: "POST", url: `${backendUrl}/task` }, (req) => {
      const newTask = new Task(autoIncrementingId, req.body.text, false);

      autoIncrementingId += 1;

      tasksStub.items.push(newTask);
      req.reply(newTask);
    }).as("postTask");

    addInterceptsForTask(1);
    addInterceptsForTask(2);
    addInterceptsForTask(3);

    // Cypress does not allow adding intercepts inside a promise (like an intercept)
    // it would be ideal to wrap this call in the POST intercept, but it is what it is.
    addInterceptsForTask(4);

    cy.visit("http://localhost:3000");

    cy.wait("@getTasks");

    cy.get("[data-cy=task-card]").should("have.length", 3);

    cy.get("[data-cy=new-task]")
      .should("be.visible")
      .find("[data-cy=text-area]")
      .click();

    cy.get("[data-cy=new-task]")
      .find("[data-cy=text-area]")
      .type("Hello World!");

    cy.get("[data-cy=new-task]").find("[data-cy=save-button]").click();

    cy.wait("@postTask");

    cy.get("[data-cy=task-card]").should("have.length", 4);

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=text-area]")
      .invoke("text")
      .should("match", /^Hello World!\s*/);

    cy.get("[data-cy=task-card]").first().find("[data-cy=text-area]").click();

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=text-area]")
      .type(" What a wonderful day!");

    cy.get("[data-cy=task-card]").first().find("[data-cy=save-button]").click();

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=text-area]")
      .invoke("text")
      .should("match", /^Hello World! What a wonderful day!\s*/);

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=task-checkbox]")
      .click();

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=task-checkbox]")
      .should("be.checked");

    cy.get("[data-cy=task-card]").first().find("[data-cy=text-area]").click();

    cy.get("[data-cy=task-card]")
      .first()
      .find("[data-cy=delete-button]")
      .click();

    cy.get("[data-cy=task-card]").should("have.length", 3);
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
