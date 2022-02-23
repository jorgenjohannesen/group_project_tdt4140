import { BACKEND_URL } from "../../utils/constants";

const Hike = ({ hike }) => {
  const {
    attributes: { description },
  } = hike;

  return <div>{description}</div>;
};

export const getServerSideProps = async (context) => {
  const id = context.query.id;

  const response = await fetch(`${BACKEND_URL}/api/hikes/${id}?populate=*`);
  const result = await response.json();
  const hike = result.data;

  if (hike === null) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    props: { hike },
  };
};

export default Hike;
