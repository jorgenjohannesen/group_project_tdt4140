import nookies from "nookies";

/**
 * Redirects the user to a destination if a JWT is already stored as a cookie.
 *
 * @param {*} context is the context stemming from Next.js, provided by the page the user tries to visit.
 * @param {string} destination is the route to redirect the user to. Defaults to the index page at "/".
 *
 * @returns an object for redirecting the user to the destination if a JWT is defined. Else, simply pass empty props to the receipient page.
 */
const redirectIfAuthenticated = (context, destination = "/") => {
  const cookies = nookies.get(context);

  const jwt = cookies.jwt || null;

  if (jwt) {
    return { redirect: { destination: destination, permanent: false } };
  }

  return { props: {} };
};

export default redirectIfAuthenticated;
