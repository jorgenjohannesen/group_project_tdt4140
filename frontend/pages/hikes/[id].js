import { BACKEND_URL } from "../../utils/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";
import { STATUS } from "../../utils/constants";
import Typography from "@mui/material/Typography";
import { red, green, grey } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";
import ReportIcon from "@mui/icons-material/Report";
import capitalize from "../../utils/capitalize";

const Hike = ({ hike: hikeInput }) => {
  const [userId, setUserId] = useState(undefined);
  const [hike, setHike] = useState(hikeInput);
  const [participantIds, setParticipantIds] = useState([]);
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [userIsParticipating, setUserIsParticipating] = useState(false);

  const {
    id,
    attributes: {
      title,
      description,
      participants: { data: participants },
      ownedBy: {
        data: { ownedBy },
      },
    },
  } = hike;

  // Set userId when page loads
  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    setUserId(userId);

    console.log(userId);

    if (userId) {
      const userIsParticipating =
        participants.filter((p) => p.id === userId).length === 1;

      setUserIsParticipating(userIsParticipating);
    } else {
      setUserIsParticipating(false);
    }
  }, []);

  // Set list of participant IDs when hike state is updated
  useEffect(() => {
    const participantIds = hike.attributes.participants.data.map(
      (participant) => participant.id
    );
    setParticipantIds(participantIds);
  }, [hike]);

  const handleSignOffForHike = async () => {
    // Remove participant from participant list
    const indexToRemove = participantIds.indexOf(userId);
    participantIds.splice(indexToRemove, 1);

    const payload = {
      data: { ...hike, participants: participantIds },
    };

    await axios
      .put(`${BACKEND_URL}/api/hikes/${id}?populate=*`, payload)
      .then((response) => {
        const hike = response.data.data;
        setStatusCode(response.status);
        setHike(hike);
        setFeedback("You're now signed off this hike!");
        setUserIsParticipating(false);
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;
        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}.`);
      });
  };

  const handleSignUpForHike = async () => {
    participantIds.push(userId);

    const payload = {
      data: { ...hike, participants: participantIds },
    };

    await axios
      .put(`${BACKEND_URL}/api/hikes/${id}?populate=*`, payload)
      .then((response) => {
        const hike = response.data.data;
        setStatusCode(response.status);
        setHike(hike);
        setFeedback("You're now signed up for this hike!");
        setUserIsParticipating(true);
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;
        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}.`);
      });
  };

  const handleReport = async () => {
    const payload = {
      data: { ...hike, isReported: true },
    };

    await axios
      .put(`${BACKEND_URL}/api/hikes/${id}?populate=*`, payload)
      .then((response) => {
        setStatusCode(response.status);
        setFeedback("Successfully reported hike!");
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;
        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}.`);
      });
  };

  // Every time that state of the status code is updated, update the severity in the alert correspondingly.
  useEffect(() => {
    if (statusCode === STATUS.OK) {
      setSeverity("success");
    } else if (statusCode === STATUS.BAD_REQUEST) {
      setSeverity("error");
    } else {
      setSeverity("warning");
    }
  }, [statusCode]);

  return (
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

      {userId && (
        <Button
          onClick={
            userIsParticipating ? handleSignOffForHike : handleSignUpForHike
          }
          sx={{
            width: 1 / 4,
            backgroundColor: userIsParticipating ? red[300] : green[300],
            color: "black",
            "&:hover": {
              backgroundColor: userIsParticipating ? red[200] : green[200],
            },
          }}
          variant="contained"
          startIcon={userIsParticipating ? <ClearIcon /> : <AddIcon />}
        >
          {userIsParticipating ? "Sign off for hike" : "Sign up for hike"}
        </Button>
      )}

      {participants && (
        <Box>
          {participants.map((participant) => {
            const {
              id,
              attributes: { username },
            } = participant;

            return <Typography variant="subtitle1">{username}</Typography>;
          })}
        </Box>
      )}

      {userId && hike.attributes.ownedBy.data.id !== userId && (
        <Button
          onClick={handleReport}
          sx={{
            width: 1 / 4,
            backgroundColor: grey[300],
            color: "black",
            "&:hover": {
              backgroundColor: grey[200],
            },
          }}
          variant="contained"
          startIcon={<ReportIcon />}
        >
          Report
        </Button>
      )}
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const id = context.query.id;

  const response = await fetch(`${BACKEND_URL}/api/hikes/${id}?populate=*`);
  const result = await response.json();
  const hike = result.data;

  if (hike === null) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    props: { hike },
  };
};

export default Hike;
