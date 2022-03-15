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
  it("can toggle if user is commercial", () => {
    cy.get('input[type="checkbox"]').check().should('be.checked');
    cy.get('input[type="checkbox"]').uncheck().should('not.be.checked');
  })
});
