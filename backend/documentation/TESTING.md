# Test documentation

## Before running the tests

In order to synchronize permissions and roles from the development environment to the test environment, you'll need to synchronize some settings before tests are able to run.

Begin by starting Strapi in development mode.

```sh
cd backend

npm run dev
```

Navigate to the **Config Sync** tab in the admin panel.

Click the **Make Initial Export** button, and then **Yes**.

Your roles and permissions are now synchronized between the development and test environment. **Your tests should now be able to run**.

## Running the tests

```sh
# Navigate to the backend directory
cd backend

# Run tests
npm run test
```

## Writing tests

All tests are written in the `tests` directory.

`app.test.js` is responsible for setting up and tearing down the tests.

When writing a new test for an entity, start by making a directory corresponding to the name of the entity in plural form (e.g. `hikes`, `users`, etc...). Add a file called `index.js` to this directory. Navigate to `app.test.js` and require the directory at the bottom of the file. Below is an example of adding this:

```js
require("./hikes");
```

Please use [the existing tests](../tests/hikes/index.js) for reference when setting up a new test.

## Test environment versus production environment

Strapi testing is set up in a way that mirrors entities, roles and permissions to the production environment. The only noticeable difference is the fact that data is persisted in the test database in the [`.tmp`](../.tmp/) directory. This test database is deleted when tearing down Strapi after each test run. For more information, see the `tearDownStrapi` function in [`helpers/strapi.js`](../tests/helpers/strapi.js).
