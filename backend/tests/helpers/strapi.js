const fs = require("fs");
const Strapi = require("@strapi/strapi");

let instance;

/**
 * Sets up a globally available instance of Strapi.
 *
 * @returns an instance of Strapi. This return value is not necessarily used, but this is required by the official Strapi docs.
 */
async function setupStrapi() {
  if (!instance) {
    instance = await Strapi().load();
    instance.server.mount(); // Strapi is global now

    instance = instance.server.app.callback();
  }
  return instance;
}

/**
 * Tears down Strapi after testing.
 * Destroys the server and removes the test database file.
 */
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

/**
 * Sets provided permission to the public user in Strapi.
 * This is not very secure, but should be sufficient for TDT4140.
 * This is crucial when testing creating, updating and deleting entities that are locked behind a given permission in production.
 *
 * @param {{
 *  entity: [string]
 * }} newPermissions is the permissions for the public user during a test.
 */
async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({
      where: {
        type: "public",
      },
    });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });

  await Promise.all(allPermissionsToCreate);
}

module.exports = {
  setupStrapi,
  tearDownStrapi,
  setPublicPermissions,
};
