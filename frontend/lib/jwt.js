import nookies from "nookies";
import jwt_decode from "jwt-decode";

/**
 * Sets the JWT token as a cookie if the response is valid.
 *
 * @param {AxiosResponse<any, any>} response is the response from the HTTP request.
 */
export const setJwtIfDefined = (response) => {
  const { jwt } = response.data;

  const receivedJwt = jwt !== null;

  if (receivedJwt) {
    nookies.set({ response }, "jwt", jwt, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
};

/**
 * Gets the currently logged in user's ID if a JWT token is set.
 * @returns the currently logged in user's ID if a JWT token is set, or undefined if no JWT token is set.
 */
export const getUserIdFromJwtOrUndefined = (context = null) => {
  const cookies = nookies.get(context);
  const jwt = cookies.jwt || null;
  if (jwt) {
    const { id } = jwt_decode(jwt);

    return id;
  }

  return undefined;
};
