import nookies from "nookies";

/**
 * Sets the JWT token as a cookie if the response is valid.
 *
 * @param {AxiosResponse<any, any>} response is the response from the HTTP request.
 */
const setJwtIfDefined = (response) => {
  const { jwt } = response.data;

  const receivedJwt = jwt !== null;

  if (receivedJwt) {
    nookies.set({ response }, "jwt", jwt, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
};

export default setJwtIfDefined;
