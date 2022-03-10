import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import HikeListUser from "../../components/HikeListUser";
import { BACKEND_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";

const User = ({ yourHikes, participatedHikes, owner }) => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    if (userId) {
      setUserId(userId);
    }
  }, []);

  const { id: ownerId, username } = owner;

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid container item xs={12} md={8}>
          <Typography variant="h4">
            {ownerId == userId ? "Your " : `${username}'s`} hikes
          </Typography>
          <HikeListUser hikes={yourHikes}></HikeListUser>
        </Grid>
        <Grid container item xs={12} md={4}>
          <Typography variant="h4">
            Hikes {ownerId == userId ? "you've" : `${username} has`}{" "}
            participated in
          </Typography>
          <HikeListUser hikes={participatedHikes}></HikeListUser>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const id = context.params.id;

  const hikeResponse = await fetch(`${BACKEND_URL}/api/hikes?populate=*`);
  const hikeResult = await hikeResponse.json();
  const hikes = hikeResult.data;

  const yourHikes = hikes.filter(
    (hike) => id == hike.attributes.ownedBy?.data?.id
  );

  const participatedHikes = hikes.filter((hike) => {
    const hikeParticipantList = hike.attributes?.participants?.data;
    for (let p of hikeParticipantList) {
      if (p.id == id) return true;
    }
    return false;
  });

  const ownerResponse = await fetch(`${BACKEND_URL}/api/users/${id}`);
  const owner = await ownerResponse.json();

  return { props: { yourHikes, participatedHikes, owner } };
};

export default User;
