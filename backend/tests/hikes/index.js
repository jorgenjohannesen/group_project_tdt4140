const request = require("supertest");
const { setPublicPermissions } = require("../helpers/strapi");

beforeAll(async () => {
  // Set up public permission for testing creation of a hike
  await setPublicPermissions({
    hike: ["create"],
  });
});

it("should get hikes", async (done) => {
  await request(strapi.server.httpServer).get("/api/hikes").expect(200);

  done();
});

it("should create a hike", async (done) => {
  await request(strapi.server.httpServer)
    .post("/api/hikes")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send({
      data: {
        title: "Test hike",
      },
    })
    .expect(200);

  done();
});
