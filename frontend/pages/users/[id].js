import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import HikeListUser from "../../components/HikeListUser";
import { BACKEND_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";
import Box from "@mui/material/Box";
import placeholder from "/placeholder.jpg";
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
      <Grid container item alignItems="center" direction="column">
        <Grid item xs={5}>
          <Container>
            <div style={{ borderRadius:"50%", overflow: 'hidden', width:350, height:350}}>
              <Image
                src={profilePictureURL || placeholder}
                height={350}
                width={350}
                layout="intrinsic"
              />
            </div>
          </Container>
        </Grid>
        <Grid item xs={4}>
          <Container>
            <Typography variant="h1" sx={{textAlign:"center"}}>{username}</Typography>
          </Container>
        </Grid>
      </Grid>
      <Grid container xs={6}>
        <Container>
          {isCommercial && (
            <Box>
              <Typography variant="h5">Who is {username}?</Typography>
              <Typography variant="subtitle1">{description}</Typography>
            </Box>
          )}
        </Container>
      </Grid>
      <Grid container item xs={12} justifyContent="center" alignItems="flex-start">
        <Grid container item sm={12} md={6} direction="column" alignItems="center" justifyContent="flex-start">
          <Grid item>
            <Typography variant="h4">
              {ownerId == userId ? "My " : `${username}'s`} hikes
            </Typography>
          </Grid>
          <HikeListUser hikes={yourHikes}></HikeListUser>
        </Grid>
        {isCommercial ? <></> : 
        <Grid container item sm={12} md={6} direction="column" alignItems="center" justifyContent="flex-start">
          <Typography variant="h4">
            Hikes {ownerId == userId ? "I have" : `${username} has`}{" "}
            participated in
          </Typography>
          <HikeListUser hikes={participatedHikes}></HikeListUser>
        </Grid>}
      </Grid>
    </Grid>);
  // return (
  //   <Container maxWidth="xl">
  //     <Grid container spacing={2}>
  //       {isCommercial && (
  //         <Box>
  //           <Typography variant="h5">Who is {username}?</Typography>
  //           <Typography variant="subtitle1">{description}</Typography>
  //         </Box>
  //       )}
  //       <Grid container item xs={12} md={6}>
  //         <Typography variant="h4">
  //           {ownerId == userId ? "Your " : `${username}'s`} hikes
  //         </Typography>
  //         <HikeListUser hikes={yourHikes}></HikeListUser>
  //       </Grid>
  //       <Grid container item xs={12} md={6}>
  //         <Typography variant="h4">
  //           Hikes {ownerId == userId ? "you've" : `${username} has`}{" "}
  //           participated in
  //         </Typography>
  //         <HikeListUser hikes={participatedHikes}></HikeListUser>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // );
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

  const profilePictureURL = `${BACKEND_URL}/uploads/27_bb3b0c988b.jpg`;

  const ownerResponse = await fetch(`${BACKEND_URL}/api/users/${id}`);
  const owner = await ownerResponse.json();

  return { props: { yourHikes, participatedHikes, owner, profilePictureURL } };
};

export default User;
