import { BACKEND_URL } from "../../utils/constants";

describe("Register page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
  });

  it("can render form fields", () => {
    cy.get("[data-cy=input-username]").click();
    cy.get("[data-cy=input-email]").click();
    cy.get("[data-cy=input-password]").click();
  });

  it("can navigate to the login page", () => {
    cy.get("[data-cy=login-link]").click();

    // Check that we ended up on the login page
    cy.location("pathname").should("match", /\/login$/);
  });

  it("displays success message when getting a 201 status code", () => {
    // Intercept the call to register user on backend
    cy.intercept(
      { method: "POST", url: `${BACKEND_URL}/api/users` },
      { response: { status: 201 } }
    ).as("register");

    // Define mock user
    const MOCK_USER = {
      username: "tester",
      email: "tester@example.com",
      password: "password",
    };

    // Input form data
    cy.get("[data-cy=input-username]").type(MOCK_USER.username);
    cy.get("[data-cy=input-email]").type(MOCK_USER.email);
    cy.get("[data-cy=input-password]").type(MOCK_USER.password);

    // Click button to submit data
    cy.get("[data-cy=submit-button]").click();

    cy.wait("@register");

    // Check that we got the appropriate user feedback
    cy.get("[data-cy=alert]").should(($alert) => {
      expect($alert).to.contain("Success");
    });
  });

  // TODO: Test that it displays error message when getting a 400 status code
});
