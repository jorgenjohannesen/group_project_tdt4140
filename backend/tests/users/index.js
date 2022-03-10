const request = require("supertest");

const MOCK_USER = {
  username: "tester",
  email: "tester@strapi.com",
  provider: "local",
  password: "1234abcd",
  confirmed: true,
  blocked: null,
};

it("can login user and return jwt token", async () => {
  // Creates a new user and save it to the database
  await strapi.plugins["users-permissions"].services.user.add({
    ...MOCK_USER,
  });

  // Login user and return jwt token
  await request(strapi.server.httpServer)
    .post("/api/auth/local")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send({
      identifier: MOCK_USER.email,
      password: MOCK_USER.password,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.jwt).toBeDefined();
    });
});
