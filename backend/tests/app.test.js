const fs = require("fs");
const { setupStrapi, tearDownStrapi } = require("./helpers/strapi");

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await tearDownStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./users");
