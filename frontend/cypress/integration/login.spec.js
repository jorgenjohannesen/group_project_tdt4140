import { DELAY_BEFORE_REROUTING_IN_MS } from "../../pages/login";
import { BACKEND_URL } from "../../utils/constants";

describe("Login page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("can render form fields", () => {
    cy.get("[data-cy=input-identifier]").click();
    cy.get("[data-cy=input-password]").click();
  });

  it("can navigate to the register page", () => {
    cy.get("[data-cy=register-link]").click();

    // Check that we ended up on the register page
    cy.location("pathname").should("match", /\/register$/);
  });

  it("displays success message when getting a 200 status code", () => {
    // Intercept the call to register user on backend
    cy.intercept(
      { method: "POST", url: `${BACKEND_URL}/api/auth/local` },
      { response: { status: 200 } }
    ).as("login");

    // Define mock user
    const MOCK_USER = {
      identifier: "tester",
      password: "password",
    };

    // Input form data
    cy.get("[data-cy=input-identifier]").type(MOCK_USER.identifier);
    cy.get("[data-cy=input-password]").type(MOCK_USER.password);

    // Click button to submit data
    cy.get("[data-cy=submit-button]").click();

    cy.wait("@login");

    // Check that we got the appropriate user feedback
    cy.get("[data-cy=alert]").should(($alert) => {
      expect($alert).to.contain("Success");
    });

    // Wait for provided time, and then route user to the index page
    cy.wait(DELAY_BEFORE_REROUTING_IN_MS);

    // Check that user was re-routed to the index page after logging in
    cy.location("pathname").should("eq", "/");
  });

  // TODO: Test that it displays error message when getting a 400 status code
});
