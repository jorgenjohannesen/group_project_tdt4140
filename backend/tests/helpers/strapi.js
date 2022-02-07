const Strapi = require("@strapi/strapi");

let instance;

async function setupStrapi() {
  if (!instance) {
    instance = await Strapi().load();
    instance.server.mount(); // strapi is global now

    instance = instance.server.app.callback();
  }
  return instance;
}

async function tearDownStrapi() {
  const dbSettings = strapi.config.get("database.connection.connection");

  //close server to release the db-file
  await strapi.server.destroy();

  //delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${dbSettings.filename}`;

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

module.exports = {
  setupStrapi,
  tearDownStrapi,
};
