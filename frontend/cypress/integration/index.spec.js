describe("Index page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("can apply filters", () => {
    cy.get("[data-cy=filterButton]").click();
  });

  it("can input text-filter and apply", () => {
    cy.get("[data-cy=textFilter]").click().type("Trail");
    cy.get("[data-cy=filterButton]").click();
  });
});
