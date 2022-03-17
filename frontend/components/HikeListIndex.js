import Grid from "@mui/material/Grid";
import HikeCard from "./HikeCard";

const HikeListIndex = ({ hikes }) => {
  return (
    <Grid data-cy="hikeListIndex" container spacing={2}>
      {hikes &&
        hikes.map((hike, index) => <HikeCard hike={hike} key={index} />)}
    </Grid>
  );
};

export default HikeListIndex;
