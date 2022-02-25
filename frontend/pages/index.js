import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { BACKEND_URL } from "../utils/constants";
import HikeList from "../components/HikeList";

const Home = ({ hikes }) => {
  return (
    <Container>
      <HikeList hikes={hikes} />
    </Container>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${BACKEND_URL}/api/hikes?populate=photo`);
  const result = await response.json();
  const hikes = result.data;

  return {
    props: {
      hikes,
    },
  };
};

export default Home;
