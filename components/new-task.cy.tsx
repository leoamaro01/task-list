import NewTask from "./new-task";

import "../cypress/support/component";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

describe("<NewTask /> closed", () => {
  it("should render and show an icon and a placeholder text", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    // icon
    cy.get("svg").should("be.visible");

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .should("have.text", "")
      .should("have.attr", "aria-placeholder")
      .should("equal", "Type to add a new task");

    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<NewTask /> opened", () => {
  it("should show the action bar when opened", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]")
      .should("be.visible")
      .should("have.text", "")
      .should("have.attr", "aria-placeholder")
      .should("equal", "Type to add a new task");

    cy.get("[data-cy=actions-bar]").should("be.visible");
  });
});

describe("<NewTask /> opened and written to", () => {
  it("should show the written text", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").should("be.visible").should("have.text", "");

    cy.get("[data-cy=text-area]").type("Hello World!");

    cy.get("[data-cy=text-area]").should("have.text", "Hello World!");
  });
});

describe("<NewTask /> opened and written to with tags", () => {
  it("should have a button for every tag", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").should("be.visible").should("have.text", "");

    cy.get("[data-cy=text-area]").type(
      "Hello World! #new-day @dev-team check this! Tell someone at support@company.com that google.com is the new rad!"
    );

    // to force it to apply the tags
    cy.get("[data-cy=text-area]").blur();

    cy.get("[data-cy=text-area]").find("button").should("have.length", 4);
  });
});

describe("<NewTask /> opened, written to, and closed with escape", () => {
  it("should close when escape is pressed, and the text should remain when opened, but not when closed", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type("Hello World!");

    cy.get("[data-cy=text-area]").should("have.text", "Hello World!");

    cy.get("[data-cy=text-area]").type("{esc}");

    cy.get("[data-cy=text-area]").should("have.text", "");

    cy.get("[data-cy=actions-bar]").should("not.exist");

    // it should still have the original text when opened
    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]")
      .invoke("text")
      .should("match", /^Hello World!\s*/);
  });
});

describe("<NewTask /> opened, written to, and saved by hitting enter", () => {
  it("should call the save event with the written text when pressing enter", () => {
    const onAddNewTaskSpy = cy.spy().as("onAddNewTaskSpy");

    cy.mount(<NewTask onAddTask={onAddNewTaskSpy} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type("Hello World!");

    cy.get("[data-cy=text-area]").should("have.text", "Hello World!");

    cy.get("[data-cy=text-area]").type("{enter}");

    cy.get("@onAddNewTaskSpy").should("have.been.calledWith", "Hello World!");

    // it should be closed
    cy.get("[data-cy=actions-bar]").should("not.exist");

    // it should be clear when opened
    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").should("have.text", "");
  });
});

describe("<NewTask /> opened, written to, and closed by clicking the cancel button", () => {
  it("should close when the button is clicked", () => {
    cy.mount(<NewTask onAddTask={() => {}} />);

    cy.get("[data-cy=text-area]").click();

    // in mobile mode the cancel button is replaced by a save button
    if (Cypress.config("viewportWidth") >= 1230) {
      cy.get("[data-cy=text-area]").type("Hello World!");

      cy.get("[data-cy=text-area]").should("have.text", "Hello World!");
    }

    cy.get("[data-cy=cancel-button]").click();

    cy.get("[data-cy=text-area]").should("have.text", "");

    cy.get("[data-cy=actions-bar]").should("not.exist");
  });
});

describe("<NewTask /> opened, written to, and saved by clicking the save button", () => {
  it("should call the save event with the written text when clicking the save button", () => {
    const onAddNewTaskSpy = cy.spy().as("onAddNewTaskSpy");

    cy.mount(<NewTask onAddTask={onAddNewTaskSpy} />);

    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").type("Hello World!");

    cy.get("[data-cy=text-area]").should("have.text", "Hello World!");

    cy.get("[data-cy=save-button]").click();

    cy.get("@onAddNewTaskSpy").should("have.been.calledWith", "Hello World!");

    // it should be closed
    cy.get("[data-cy=actions-bar]").should("not.exist");

    // it should be clear when opened
    cy.get("[data-cy=text-area]").click();

    cy.get("[data-cy=text-area]").should("have.text", "");
  });
});

export {};
