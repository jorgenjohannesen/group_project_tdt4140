import { Container, Typography } from "@mui/material";
import HikeList from "../../components/HikeList";
import { BACKEND_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";

const User = ({ hikes }) => {
  const [userId, setUserId] = useState(undefined);
  const [yourHikes, setYourHikes] = useState([]);

  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    if (userId) {
      setUserId(userId);

      const yourHikes = hikes.filter(
        (hike) => userId == hike.attributes.ownedBy?.data?.id
      );
      setYourHikes(yourHikes);
    }
  }, []);

  return (
    <Container>
      <Typography variant="h3">Your hikes</Typography>
      <HikeList hikes={yourHikes}></HikeList>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  const userId = getUserIdFromJwtOrUndefined(context);

  if (!userId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const response = await fetch(`${BACKEND_URL}/api/hikes?populate=*`);
  const result = await response.json();

  const hikes = result.data;

  return { props: { hikes } };
};

export default User;
