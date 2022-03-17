import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import HikeListUser from "../../components/HikeListUser";
import { BACKEND_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";
import Box from "@mui/material/Box";
import defaultProfilePicture from "/defaultProfilePicture.jpg";
import Image from "next/image";

const User = ({ yourHikes, participatedHikes, owner, profilePictureURL }) => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    if (userId) {
      setUserId(userId);
    }
  }, []);

  const { id: ownerId, username, email, isCommercial, description } = owner;

  return (
    <Grid container spacing={8} justifyContent="flex-start" alignItems="center" direction="column">
      <Grid container item xs={5} alignItems="center" direction="column">
        <Grid item container xs={5}>
          <Container sx={{
            width: "350px",
            maxWidth: "50%",
          }}>
            <Box sx={{
              borderRadius: "50%",
              overflow: 'hidden',
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: "1px",
            }}>
              <Image
                src={profilePictureURL || defaultProfilePicture}
                height={350}
                width={350}
                layout="responsive"
              />
            </Box>
          </Container>
        </Grid>
        <Grid item xs={4}>
          <Container>
            <Typography variant="h2" sx={{textAlign:"center", fontSize: "10vmin"}}>{username}</Typography>
          </Container>
        </Grid>
      </Grid>
      <Grid container xs={6}>
        <Container>
          {isCommercial && description && (
            <Box>
              <Typography variant="h5" sx={{fontSize: "5vmin"}}>Who is {username}?</Typography>
              <Typography variant="subtitle1" sx={{fontSize: "2vmin"}}>{description}</Typography>
            </Box>
          )}
        </Container>
      </Grid>
      <Grid container item xs={12} rowSpacing={5} justifyContent="center" alignItems="flex-start">
        <Grid container item sm={12} md={6} direction="column" alignItems="center" justifyContent="flex-start">
          <Grid item>
            <Typography variant="h4" sx={{fontSize: "4vmin"}}>
              {ownerId == userId ? "My " : `${username}'s`} hikes
            </Typography>
          </Grid>
          <HikeListUser hikes={yourHikes}></HikeListUser>
        </Grid>
        {participatedHikes.length > 0 &&
        <Grid container item sm={12} md={6} direction="column" alignItems="center" justifyContent="flex-start">
          <Typography variant="h4" sx={{fontSize: "4vmin"}}>
            Hikes {ownerId == userId ? "I have" : `${username} has`}{" "}
            participated in
          </Typography>
          <HikeListUser hikes={participatedHikes}></HikeListUser>
        </Grid>}
      </Grid>
    </Grid>);
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

  let profilePictureURL = null;
  if (owner.profilePictureFileName != null) {
    const profilePictureResponse = await fetch(`${BACKEND_URL}/api/upload/files/${owner.profilePictureFileName}`);
    const profilePicture = await profilePictureResponse.json();
    if(profilePicture.url != null){
      profilePictureURL = `${BACKEND_URL}${profilePicture?.url}`
    }
  }

  return { props: { yourHikes, participatedHikes, owner, profilePictureURL } };
};

export default User;
