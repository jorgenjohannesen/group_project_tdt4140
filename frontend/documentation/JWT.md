# JWT documentation

## What is a JWT token?

In order to know that a user is logged in, we need to store their JWT token. The JWT token is sent by Strapi when a user registers successfully, or when a user logs in successfully. This token can then be used to validate if the user has a valid session on our website.

## Implementation

Please see [`setJwtIfDefined`](../lib/setJwtIfDefined.js) for the implementation of setting a JWT token as a cookie.

The [nookies](https://github.com/maticzav/nookies) library is used to set the JWT token. Nookies is a helper for setting cookies when using Next.js.

A user may also be redirected to a destination route if the user is authenticated. Please see [`redirectIfAuthenticated`](../lib/redirectIfAuthenticated.js) for the implementation.
