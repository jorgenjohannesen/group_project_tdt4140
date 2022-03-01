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
});
