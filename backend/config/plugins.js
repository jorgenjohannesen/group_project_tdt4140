module.exports = ({ env }) => ({
  // ...
  "config-sync": {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      importOnBootstrap: true,
    },
  },
});
