import nookies from "nookies";

const Logout = () => {
  return <></>;
};

export const getServerSideProps = async (context) => {
  nookies.destroy(context, "jwt", {
    path: "/",
  });

  return { redirect: { destination: "/", permanent: false } };
};

export default Logout;
