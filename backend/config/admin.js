module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '86cb093de89680a173b7c866625923d7'),
  },
});
