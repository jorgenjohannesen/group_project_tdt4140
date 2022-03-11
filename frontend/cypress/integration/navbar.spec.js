describe("Navbar component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("can navigate to index page", () => {
    cy.get("[data-cy=navbar-index-link]").click();

    cy.location("pathname").should("eq", "/");
  });

  it("can navigate to login page", () => {
    cy.get("[data-cy=navbar-login-page-button]").click();

    cy.location("pathname").should("eq", "/login");
  });

  it("can navigate to register page", () => {
    cy.get("[data-cy=navbar-register-page-button]").click();

    cy.location("pathname").should("eq", "/register");
  });
});
