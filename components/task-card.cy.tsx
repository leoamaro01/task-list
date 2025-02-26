import TaskCard from "./task-card";

import "../cypress/support/component";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

describe("<TaskCard /> closed", () => {
  it("should render and show a checkbox and Hello World! as a text", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=task-checkbox]").should("be.visible").and("be.checked");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World!\s*/);

    cy.get("[data-cy=text-area]")
      .should("have.attr", "aria-placeholder")
      .should("equal", "Write the name of the task");

    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<TaskCard /> opened", () => {
  it("should show the action bar when opened", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World!\s*/);

    cy.get("[data-cy=actions-bar]").should("be.visible");
  });
});

describe("<TaskCard /> opened and written to", () => {
  it("should show the written text", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type(" What a nice morning!");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World! What a nice morning!\s*/);
  });
});

describe("<TaskCard /> opened and written to with tags", () => {
  it("should have a button for every tag", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type(
      " #new-day @dev-team check this! Tell someone at support@company.com that google.com is the new rad!"
    );

    // to force it to apply the tags
    cy.get("[data-cy=text-area]").blur();

    cy.get("[data-cy=text-area]").find("button").should("have.length", 4);
  });
});

describe("<TaskCard /> opened, written to, and closed with escape", () => {
  it("should close when escape is pressed, and the text should remain when opened, but not when closed", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type(" What a nice morning!");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World! What a nice morning!\s*/);

    cy.get("[data-cy=text-area]").type("{esc}");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World!\s*/);

    cy.get("[data-cy=actions-bar]").should("not.exist");

    // it should still have the original text when opened
    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]")
      .invoke("text")
      .should("match", /^Hello World!\s*/);
  });
});

describe("<TaskCard /> opened, written to, and saved by hitting enter", () => {
  it("should call the save event with the written text when pressing enter", () => {
    const onSaveTaskSpy = cy.spy().as("onSaveTaskSpy");

    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={onSaveTaskSpy}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type(" What a nice morning!");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World! What a nice morning!\s*/);

    cy.get("[data-cy=text-area]").type("{enter}");

    cy.get("@onSaveTaskSpy").should(
      "have.been.calledWithMatch",
      1,
      /^Hello World! What a nice morning!\s*/
    );

    // it should be closed
    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<TaskCard /> opened, written to, and closed by clicking the cancel button", () => {
  it("should close when the button is clicked", () => {
    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    // in mobile mode the cancel button is replaced by a save button
    if (Cypress.config("viewportWidth") >= 1230) {
      cy.get("[data-cy=text-area]").type(" What a nice morning!");

      cy.get("[data-cy=text-area]")
        .should("be.visible")
        .invoke("text")
        .should("match", /^Hello World! What a nice morning!\s*/);
    }

    cy.get("[data-cy=cancel-button]").click();

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World!\s*/);

    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<TaskCard /> opened, written to, and saved by clicking the save button", () => {
  it("should call the save event with the written text when clicking the save button", () => {
    const onSaveTaskSpy = cy.spy().as("onSaveTaskSpy");

    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={onSaveTaskSpy}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type(" What a nice morning!");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .invoke("text")
      .should("match", /^Hello World! What a nice morning!\s*/);

    cy.get("[data-cy=save-button]").click();

    cy.get("@onSaveTaskSpy").should(
      "have.been.calledWithMatch",
      1,
      /^Hello World! What a nice morning!\s*/
    );

    // it should be closed
    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<TaskCard /> opened, and clicked the delete button", () => {
  it("should call the delete event when clicking the delete button", () => {
    const onDeleteTaskSpy = cy.spy().as("onDeleteTaskSpy");

    cy.mount(
      <TaskCard
        onDelete={onDeleteTaskSpy}
        onSave={() => {}}
        onTaskToggled={() => {}}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=delete-button]").click();

    cy.get("@onDeleteTaskSpy").should("have.been.calledWith", 1);
  });
});

describe("<TaskCard /> opened, and clicked the task checkbox", () => {
  it("should call the toggled event with the new value", () => {
    const onToggleTaskSpy = cy.spy().as("onToggleTaskSpy");

    cy.mount(
      <TaskCard
        onDelete={() => {}}
        onSave={() => {}}
        onTaskToggled={onToggleTaskSpy}
        taskChecked={true}
        taskId={1}
        taskText="Hello World!"
      />
    );

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=task-checkbox]").click();

    cy.get("@onToggleTaskSpy").should("have.been.calledWith", 1, false);
  });
});

export {};
