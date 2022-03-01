import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import HikeCard from "./HikeCard";
import Box from "@mui/material/Box";

const HikeListUser = ({ hikes }) => {
  return (
    <Grid container spacing={2}>
      {hikes.map((hike, index) => (
        <HikeCard hike={hike} key={index} columns={{xs: 12, md: 12, lg: 12}} />
      ))}
    </Grid>
  );
};

export default HikeListUser;