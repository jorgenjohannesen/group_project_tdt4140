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
import ClearIcon from "@mui/icons-material/Clear";
import { red, green, grey } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import ReportIcon from "@mui/icons-material/Report";
import capitalize from "../../utils/capitalize";
import Link from "next/link";
import router from "next/router";
import placeholder from "/placeholder.jpg";
import formatBasedOnParticipants from "../../utils/formatBasedOnParticipants";

const Hike = ({ hike: hikeInput }) => {
  const [userId, setUserId] = useState(undefined);
  const [hike, setHike] = useState(hikeInput);
  const [participantIds, setParticipantIds] = useState([]);
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [userIsParticipating, setUserIsParticipating] = useState(false);

  const {
    id: hikeId,
    attributes: {
      title,
      description,
      photo,
      price,
      difficulty,
      participants: { data: participants },
      ownedBy: {
        data: {
          attributes: { username, isCommercial },
          id: ownerId,
        },
      },
      maxNumberOfParticipants,
    },
  } = hike;

  console.log(maxNumberOfParticipants);

  // Set userId when page loads
  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    setUserId(userId);

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
      .put(`${BACKEND_URL}/api/hikes/${hikeId}?populate=*`, payload)
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

  const handleDeleteHike = async () => {
    await axios
      .delete(`${BACKEND_URL}/api/hikes/${hikeId}`)
      .then((response) => {
        setStatusCode(response.status);
        setFeedback("Successfully deleted hike!");

        router.push("/");
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;

        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}`);
      });
  };

  const handleSignUpForHike = async () => {
    const reachedMaxNumberOfParticipants =
      participants.length == maxNumberOfParticipants;

    if (reachedMaxNumberOfParticipants) {
      setStatusCode(STATUS.BAD_REQUEST);
      setFeedback(
        "The number of participants is already reached. You cannot sign up for this hike."
      );
      return;
    }
    participantIds.push(userId);

    const payload = {
      data: { ...hike, participants: participantIds },
    };

    await axios
      .put(`${BACKEND_URL}/api/hikes/${hikeId}?populate=*`, payload)
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
      .put(`${BACKEND_URL}/api/hikes/${hikeId}?populate=*`, payload)
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

  // If hike doesn't have an image, choose placeholder
  let photoUrl = placeholder;
  let photoHeight = 450;
  let photoWidth = 800;
  if (photo?.data?.attributes?.url != null) {
    photoUrl = `${BACKEND_URL}${photo.data.attributes.url}`;
    photoHeight = photo.data.attributes.height;
    photoWidth = photo.data.attributes.width;
  }

  return (
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            sm: { flexDirection: "column" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {title && (
              <Typography variant="h4" sx={{ p: 1 }}>
                {title}
              </Typography>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", p: 1 }}>
              {username && (
                <Typography variant="subtitle1" sx={{ p: 1, width: "100%" }}>
                  Posted by:{" "}
                  <Link href={`/users/${ownerId}`}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        "&:hover": { color: "lightblue", cursor: "pointer" },
                      }}
                    >
                      {username}
                    </Typography>
                  </Link>
                </Typography>
              )}

              {userId && (
                <Button
                  onClick={
                    userIsParticipating
                      ? handleSignOffForHike
                      : handleSignUpForHike
                  }
                  sx={{
                    width: 1,
                    p: 1,
                    backgroundColor: userIsParticipating
                      ? red[300]
                      : green[300],
                    color: "black",
                    "&:hover": {
                      backgroundColor: userIsParticipating
                        ? red[200]
                        : green[200],
                      my: 2,
                    },
                  }}
                  variant="contained"
                  startIcon={userIsParticipating ? <ClearIcon /> : <AddIcon />}
                >
                  {userIsParticipating
                    ? "Sign off for hike"
                    : "Sign up for hike"}
                </Button>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", my: 1, mb: 0 }}>
              {difficulty !== "none" && (
                <Typography variant="subtitle1" sx={{ p: 1, width: "100%" }}>
                  Difficulty: {capitalize(difficulty)}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              {description && (
                <Typography variant="subtitle1" sx={{ p: 1, width: "100%" }}>
                  {description}
                </Typography>
              )}
            </Box>

            <Box>
              {isCommercial && (
                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Typography variant="subtitle1" sx={{ p: 1, width: "100%" }}>
                    Price: {price}kr
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "60%",
            }}
          >
            <Box sx={{ width: "80%", my: 2 }}>
              <Image
                src={photoUrl}
                height={photoHeight}
                width={photoWidth}
                object-fit="cover"
              />
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                my: 2,
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 20 }}>
                      Participants (
                      {formatBasedOnParticipants(
                        participants,
                        maxNumberOfParticipants
                      )}
                      )
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {participants && (
                        <Box>
                          {participants.map((participant) => {
                            const {
                              id: userId,
                              attributes: { username },
                            } = participant;

                            return (
                              <Link href={`/users/${userId}`}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    "&:hover": {
                                      color: "lightblue",
                                      cursor: "pointer",
                                    },
                                  }}
                                >
                                  {username}
                                </Typography>
                              </Link>
                            );
                          })}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

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
        </Box>
      </Box>
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
