const fs = require("fs");
const { setupStrapi } = require("./helpers/strapi");

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  const dbSettings = strapi.config.get("database.connection.connection");

  //close server to release the db-file
  await strapi.server.destroy();

  //DATABASE_FILENAME=.tmp/test.db

  //delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${dbSettings.filename}`;

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./users");
