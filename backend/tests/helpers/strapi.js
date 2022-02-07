const Strapi = require("@strapi/strapi");

let instance;

async function setupStrapi() {
  if (!instance) {
    /** the following code in copied from `./node_modules/strapi/lib/Strapi.js` */
    instance = await Strapi().load();
    instance.server.mount(); // strapi is global now
    // await instance.server
    //   .use(instance.server.router.routes()) // populate KOA routes
    //   .use(instance.server.router.allowedMethods()); // populate KOA methods

    instance = instance.server.app.callback();
  }
  return instance;
}

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

const grantPrivileges = async (roleID = 1, values = []) => {
  const roles = await strapi
    .service("plugin::users-permissions.role")
    .getRoles();
  const _public = await strapi
    .service("plugin::users-permissions.role")
    .getRole(roles.filter((role) => role.type === "public")[0].id);

  for (const i in values) {
    _public.permissions[values[i]].controllers[
      values[i].split("::")[1]
    ].find.enabled = true;
  }

  await strapi
    .service("plugin::users-permissions.role")
    .updateRole(_public.id, _public);
};

module.exports = {
  setupStrapi,
  grantPrivileges,
  setPublicPermissions,
};
