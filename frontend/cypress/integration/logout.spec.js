describe("Login page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/logout");
  });

  it("can logout to index page", () => {
    cy.location("pathname").should("eq", "/");
  });
});
