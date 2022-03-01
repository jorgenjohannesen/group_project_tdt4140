import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import HikeCard from "./HikeCard";
import Box from "@mui/material/Box";

const HikeListIndex = ({ hikes }) => {
  return (
    <Grid container spacing={2}>
      {hikes.map((hike, index) => (
        <HikeCard hike={hike} key={index} />
      ))}
    </Grid>
  );
};

export default HikeListIndex;
