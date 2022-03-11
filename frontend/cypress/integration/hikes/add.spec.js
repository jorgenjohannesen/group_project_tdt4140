describe("Add hike page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/hikes/add");
  });

  it("redirects to index page if not logged in", () => {
    cy.location("pathname").should("eq", "/");
  });
});
