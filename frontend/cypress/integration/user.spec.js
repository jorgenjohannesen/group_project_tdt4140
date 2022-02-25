describe("User page", () => {
  it("can navigate to user from all hikes", () => {
    // Check that user was re-routed to the index page
    cy.visit("http://localhost:3000");
    cy.location("pathname").should("eq", "/");
    // TODO expand this test once we get a link to a user page
    // TODO ensure that we can navigate from "all hikes"-list to "user hikes"-list (Not yet implemented)
  });
});
