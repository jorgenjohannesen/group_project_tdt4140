import Container from "@mui/material/Container";
import { BACKEND_URL } from "../utils/constants";
import HikeListIndex from "../components/HikeListIndex";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";

const Home = ({ hikes }) => {
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);

  useEffect(() => {
    if (!hikes || hikes?.length == 0) {
      setSeverity("info");
      setFeedback("Oops! Doesn't look like there are any hikes to display.");
    }
  }, []);

  return (
    <Container sx={{ mb: 12 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {feedback && (
            <Alert
              severity={severity}
              sx={{ width: "65%", mx: "auto", my: 2 }}
              data-cy="alert"
            >
              {feedback}
            </Alert>
          )}
          <HikeListIndex hikes={hikes} />
        </Box>
      </Box>
    </Container>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${BACKEND_URL}/api/hikes?populate=*`);
  const result = await response.json();

  const hikes = result.data;

  // Sort hikes such that the most recent hike is first in the array
  if (hikes) {
    hikes.sort(
      (a, b) => -a.attributes.createdAt.localeCompare(b.attributes.createdAt)
    );
  }

  return {
    props: {
      hikes,
    },
  };
};

export default Home;
