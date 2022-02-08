const { setupStrapi, tearDownStrapi } = require("./helpers/strapi");

jest.setTimeout(15000);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await tearDownStrapi();
});

it("checks that Strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./users");
require("./hikes");
