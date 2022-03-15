import Container from "@mui/material/Container";
import { BACKEND_URL } from "../utils/constants";
import HikeListIndex from "../components/HikeListIndex";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { Button, Card, TextField, Typography } from "@mui/material";

const Home = ({ hikes }) => {
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [textFilter, setTextFilter] = useState("");
  const [filteredHikes, setFilteredHikes] = useState(hikes);

  useEffect(() => {
    if (!filteredHikes || filteredHikes?.length == 0) {
      setSeverity("info");
      setFeedback("Oops! Doesn't look like there are any hikes to display.");
    }
  }, []);

  function useFilter() {
    setSeverity(undefined);
    setFeedback(undefined);

    const newHikeList = hikes.filter(hike => {
      if (hike.attributes.title.toUpperCase().includes(textFilter.toUpperCase()) || hike.attributes.description.toUpperCase().includes(textFilter.toUpperCase())) {
        return hike;
      }
    });

    setFilteredHikes(newHikeList);

    if (newHikeList?.length == 0) {
      setSeverity("info");
      setFeedback("Oops! Doesn't look like there are any hikes to display.");
    }
  }

  return (
    <Container sx={{ mb: 12 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Card sx={{ backgroundColor: "#ededed", padding: "1em", marginBottom: "1em" }}>
            <Typography variant="h6">Filters:</Typography>
            <Box sx={{ margin: "0.5em 0 ", display: "flex", flexDirection: "row" }}>
              <Box sx={{ marginRight: "1em", display: "flex", flexDirection: "row" }}>
                <Typography sx={{ marginRight: "0.2em" }}>Search for text: </Typography>
                <TextField onChange={e => setTextFilter(e.target.value)} value={textFilter} size="small" variant="standard" />
              </Box>
            </Box>
            <Button variant="outlined" onClick={useFilter}>Apply</Button>
          </Card>
          {feedback && (
            <Alert
              severity={severity}
              sx={{ width: "65%", mx: "auto", my: 2 }}
              data-cy="alert"
            >
              {feedback}
            </Alert>
          )}
          <HikeListIndex hikes={filteredHikes} />
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
