const request = require("supertest");
const { setPublicPermissions } = require("../helpers/strapi");

const MOCK_HIKE = {
  data: {
    title: "Test hike",
    description: "Test description",
    date: new Date().toISOString(),
  },
};

beforeAll(async () => {
  // Set up public permission for testing creation of a hike
  await setPublicPermissions({
    hike: ["create", "update", "delete"],
  });
});

it("can get hikes", async (done) => {
  await request(strapi.server.httpServer).get("/api/hikes").expect(200);

  done();
});

it("can create a hike", async (done) => {
  await request(strapi.server.httpServer)
    .post("/api/hikes")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send(MOCK_HIKE)
    .expect(200);

  done();
});

it("can update a hike", async (done) => {
  let hikeId = 0;

  // Create hike
  await request(strapi.server.httpServer)
    .post("/api/hikes")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send(MOCK_HIKE)
    .expect(200)
    .then((data) => {
      hikeId = data.body.data.id;
    });

  // Get hike
  await request(strapi.server.httpServer)
    .get(`/api/hikes/${hikeId}`)
    .expect(200);

  const updatedTitle = "Updated hike";

  // Update hike and validate new hike
  await request(strapi.server.httpServer)
    .put(`/api/hikes/${hikeId}`)
    .send({ data: { ...MOCK_HIKE, title: updatedTitle } })
    .expect(200)
    .then((data) => {
      expect(data.body.data.attributes.title).toBe(updatedTitle);
    });

  done();
});

it("can delete a hike", async (done) => {
  let hikeId = 0;

  // Create hike
  await request(strapi.server.httpServer)
    .post("/api/hikes")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send(MOCK_HIKE)
    .expect(200)
    .then((data) => {
      hikeId = data.body.data.id;
    });

  // Get hike
  await request(strapi.server.httpServer)
    .get(`/api/hikes/${hikeId}`)
    .expect(200);

  // Delete hike
  await request(strapi.server.httpServer)
    .delete(`/api/hikes/${hikeId}`)
    .expect(200);

  done();
});
