# How to fill database with entries

1. Delete `data.db` file and create a new one with the same name for a wonderful
   fresh start. The file is located at `backend\.tmp\data.db`.
2. Start Strapi
3. Create a admin user and log in.
4. In Strapi dashboard go to media library and add all the photos located in
   `backend\data\mediafiles` in the following order:
   1. 1-17 (in bulk)
   2. 18 (in single)
   3. 19 (in single)
   4. 20 (in single)
   5. 21-30 (in bulk)
   6. 31 (in single)
   7. 32 (in single)
   8. 33 (in single)
5. Go back to code and find `shouldPopulateDatabase`. This is located at
   `backend\src\index.js`. Switch `shouldPopulateDatabase` to true and start
   Strapi, then switch it to false and start Strapi again.
6. Strapi should now be filled with entries.
7. Finally, go to Strapi dashboard and click on config sync. Then click import.
