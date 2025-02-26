import IconButton from "./icon-button";
import CircleIcon from "./svg/circle";

import "../cypress/support/component";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

describe("<IconButton /> enabled", () => {
  it("should render and show a circle icon with 'Button Text' as a text", () => {
    cy.mount(
      <IconButton
        dataCy="icon-button"
        text="Button Text"
        styleClass="bg-red-200 text-red-500"
        icon={<CircleIcon />}
      />
    );

    // button icon
    cy.get("svg").should("be.visible");

    cy.get("[data-cy=button-text]")
      .should("be.visible")
      .and("have.text", "Button Text");

    cy.get("[data-cy=icon-button]")
      .should("have.class", "bg-red-200")
      .and("have.class", "text-red-500");
  });
});

describe("<IconButton /> disabled", () => {
  it("should render and show a circle icon with 'Button Text' as a text in the disabled style", () => {
    cy.mount(
      <IconButton
        dataCy="icon-button"
        text="Button Text"
        styleClass="bg-red-200 text-red-500"
        disabled={true}
        disabledStyle="bg-gray-200 text-white"
        icon={<CircleIcon />}
      />
    );

    // button icon
    cy.get("svg").should("be.visible");

    cy.get("[data-cy=button-text]")
      .should("be.visible")
      .and("have.text", "Button Text");

    cy.get("[data-cy=icon-button]")
      .should("have.class", "bg-gray-200")
      .and("have.class", "text-white");
  });
});

describe("<IconButton /> without text", () => {
  it("should render show a circle icon but no text", () => {
    cy.mount(
      <IconButton
        dataCy="icon-button"
        styleClass="bg-red-200 text-red-500"
        icon={<CircleIcon />}
      />
    );

    // button icon
    cy.get("svg").should("be.visible");

    cy.get("[data-cy=button-text]").should("not.exist");
  });
});

describe("<IconButton /> without button", () => {
  it("should render show the text 'Button Text' but no icon", () => {
    cy.mount(
      <IconButton
        dataCy="icon-button"
        text="Button Text"
        styleClass="bg-red-200 text-red-500"
      />
    );

    // button icon
    cy.get("svg").should("not.exist");

    cy.get("[data-cy=button-text]")
      .should("be.visible")
      .and("have.text", "Button Text");
  });
});

describe("<IconButton /> clicked", () => {
  it("should fire the onClick event after being clicked", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(
      <IconButton
        dataCy="icon-button"
        text="Button Text"
        styleClass="bg-red-200 text-red-500"
        icon={<CircleIcon />}
        onClick={onClickSpy}
      />
    );
    cy.get("[data-cy=icon-button]").click();

    cy.get("@onClickSpy").should("have.been.called");
  });
});

describe("<IconButton /> disabled clicked", () => {
  it("should not fire the onClick event after being clicked", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(
      <IconButton
        dataCy="icon-button"
        text="Button Text"
        styleClass="bg-red-200 text-red-500"
        disabled={true}
        disabledStyle="bg-gray-200 text-white"
        icon={<CircleIcon />}
        onClick={onClickSpy}
      />
    );
    cy.get("[data-cy=icon-button]").click({ force: true });

    cy.get("@onClickSpy").should("not.have.been.called");
  });
});

export {};
