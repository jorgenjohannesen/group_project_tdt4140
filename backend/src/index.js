"use strict";

module.exports = {
  /*
   1. Delete data.db file and create a new one with the same name for a wonderful fresh start. The file is located at backend\.tmp\data.db.
   2. Start strapi
   3. Create your a admin user and log in.
   4. In strapi dashboard go to media libary and add all the photos from the photo folder shared in discord.
   5. Go back to code and find supercoolboolean. This is located at backend\src\index.js. Switch supercoolboolean to true and start strapi, then switch it to false and start strapi again.
   6. Strapi should now be filled with entries.
   7. You will need to set the premissions for the public role again because we deleted our database file. 
  */

  bootstrap({ strapi }) {
    const shouldPopulateDatabase = false;

    if (shouldPopulateDatabase) {
      const fs = require("fs");

      try {
        const jsonString = fs.readFileSync("./data/data.json");
        const data = JSON.parse(jsonString);

        data.listOfUsers.forEach(function (entry) {
          strapi.plugins["users-permissions"].services.user.add({
            ...entry,
          });
        });

        data.listOfHikes.forEach(function (entry) {
          strapi.plugins["content-manager"].services["entity-manager"].create(
            {
              ...entry,
            },
            "api::hike.hike"
          );
        });
      } catch (err) {
        console.log(err);
        return;
      }
    }
  },
};
