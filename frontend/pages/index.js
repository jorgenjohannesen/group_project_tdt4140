import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { BACKEND_URL } from "../utils/constants";
import HikeListIndex from "../components/HikeListIndex";

const Home = ({ hikes }) => {
  return (
    <Container>
      <HikeListIndex hikes={hikes} />
    </Container>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${BACKEND_URL}/api/hikes?populate=photo`);
  const result = await response.json();

  const hikes = result.data;

  // Sort hikes such that the most recent hike is first in the array
  hikes.sort(
    (a, b) => -a.attributes.updatedAt.localeCompare(b.attributes.updatedAt)
  );

  return {
    props: {
      hikes,
    },
  };
};

export default Home;
