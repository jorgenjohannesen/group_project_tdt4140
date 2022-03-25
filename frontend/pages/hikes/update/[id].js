import axios from "axios";
import { BACKEND_URL } from "../../../utils/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import isEmpty from "../../../utils/isEmpty";
import capitalize from "../../../utils/capitalize";
import { Alert } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { STATUS } from "../../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { getUserIdFromJwtOrUndefined } from "../../../lib/jwt";
import {
  FormGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import DateAdapter from "@mui/lab/AdapterDateFns";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const Input = styled("input")({
  display: "none",
});

const UpdateHike = ({ hike }) => {
  const {
    id: hikeId,
    attributes: {
      title: hikeTitle,
      description: hikeDescription,
      photo: hikePhoto,
      difficulty: hikeDifficulty,
      price: hikePrice,
      date: hikeDate,
      maxNumberOfParticipants: hikeMaxNumberOfParticipants,
      maxNumberOfParticipantsIsChecked: hikeMaxNumberOfParticipantsIsChecked,
      ownedBy: {
        data: {
          attributes: { username, isCommercial },
          id: ownerId,
        },
      },
    },
  } = hike;

  const router = useRouter();

  const [title, setTitle] = useState(hikeTitle);
  const [description, setDescription] = useState(hikeDescription);
  const [price, setPrice] = useState(hikePrice);
  const [downloadedPhoto, _] = useState(hikePhoto);
  const [photoToUpload, setPhotoToUpload] = useState(undefined);
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [maxNumberOfParticipants, setMaxNumberOfParticipants] = useState(
    hikeMaxNumberOfParticipants
  );
  const [width, setWidth] = useState(0);
  const [date, setDate] = useState(hikeDate);
  
  useEffect(() => { // Get the correct windowwidth from the start
    setWidth(window.innerWidth)
  });

  const [
    maxNumberOfParticipantsIsChecked,
    setMaxNumberOfParticipantsIsChecked,
  ] = useState(hikeMaxNumberOfParticipantsIsChecked);
  const [difficulty, setDifficulty] = useState(hikeDifficulty);

  const handleDeleteHike = async () => {
    await axios
      .delete(`${BACKEND_URL}/api/hikes/${hikeId}`)
      .then((response) => {
        setStatusCode(response.status);
        setFeedback("Successfully deleted hike!");

        // Wait for provided time, and then route user to the index page
        router.push("/");
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;
        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}`);
      });
  };

  const handleUpdateHike = async () => {
    // Check that user input is not empty
    if (isEmpty(title) || isEmpty(description)) {
      setFeedback("All input fields must be filled in.");
      return;
    }
    const payload = {
      data: {
        title: title,
        description: description,
        maxNumberOfParticipants: maxNumberOfParticipants,
        maxNumberOfParticipantsIsChecked: maxNumberOfParticipantsIsChecked,
        date: date,
        difficulty: difficulty,
      },
    };

    if (!photoToUpload) {
      // POST hike payload
      await axios
        .put(`${BACKEND_URL}/api/hikes/${hikeId}`, payload)
        .then((response) => {
          setStatusCode(response.status);
          setFeedback("Successfully updated hike!");
        })
        .catch((error) => {
          const errorMessage = error.response.data.error.message;
          setStatusCode(error.response.status);
          setFeedback(`Oops! ${capitalize(errorMessage)}`);
        });
    } else {
      const file = new FormData();
      file.append("files", photoToUpload);

      // POST picture
      await axios
        .post(`${BACKEND_URL}/api/upload`, file)
        .then((response) => {
          const id = response.data[0].id;
          // POST picture ID to an existing hike
          axios
            .put(`${BACKEND_URL}/api/hikes/${hikeId}`, {
              data: { ...payload.data, photo: id },
            })
            .then((response) => {
              setStatusCode(response.status);

              // Force a refresh of the site
              router.push(`/hikes/update/${hikeId}`);
            })
            .catch((error) => {
              const errorMessage = error.response.data.error.message;
              setFeedback(`Oops! ${capitalize(errorMessage)}.`);
            });
          setStatusCode(response.status);
          setFeedback("Successfully updated hike!");
        })
        .catch((error) => {
          const errorMessage = error.response.data.error.message;

          setStatusCode(error.response.status);
          setFeedback(`Oops! ${capitalize(errorMessage)}`);
        });
    }
  };

  // Every time that state of the status code is updated, update the severity in the alert correspondingly.
  useEffect(() => {
    if (statusCode === STATUS.OK) {
      setSeverity("success");
    } else if (statusCode === STATUS.BAD_REQUEST) {
      setSeverity("error");
    } else if (statusCode === STATUS.NOT_FOUND) {
      // Wait for provided time, and then route user to the index page
      router.push("/");
    } else {
      setSeverity("warning");
    }
  }, [statusCode]);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  });

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
          sx={ (width > 700) ? {
            display: "flex",
            flexDirection: "row",
          } : {
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" sx={{ p: 1 }}>
              Update hike
            </Typography>
            <TextField
              required
              label="Title"
              variant="outlined"
              defaultValue={title}
              onChange={(event) => {
                const input = event.target.value;
                setTitle(input);
              }}
              sx={{ my: 2 }}
            />
            <TextField
              required
              label="Description"
              multiline
              defaultValue={description}
              rows={6}
              variant="outlined"
              onChange={(event) => {
                const input = event.target.value;
                setDescription(input);
              }}
              sx={{ my: 2 }}
            />

            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Difficulty
              </FormLabel>
              <RadioGroup
                row
                defaultValue={hikeDifficulty}
                difficulty={hikeDifficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value);
                  console.log(difficulty);
                }}
              >
                <FormControlLabel
                  value="easy"
                  control={<Radio />}
                  label="Easy"
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="hard"
                  control={<Radio />}
                  label="Hard"
                />
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />
              </RadioGroup>
            </FormControl>

            {isCommercial && (
              <Box>
                <TextField
                  required
                  label="Price"
                  variant="outlined"
                  onChange={(event) => {
                    const input = event.target.value;
                    setPrice(input);
                  }}
                  sx={{ width: 1 / 4, my: 2 }}
                />
              </Box>
            )}

            {!isNaN(maxNumberOfParticipants) && (
              <Box>
                <FormGroup sx={{ margin: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={maxNumberOfParticipantsIsChecked} />
                    }
                    label="Check to set a maximum number of participants"
                    onChange={(event) => {
                      const input = event.target.checked;
                      setMaxNumberOfParticipantsIsChecked(input);
                      if (!input) {
                        setMaxNumberOfParticipants(null);
                      }
                    }}
                  />
                </FormGroup>
                {maxNumberOfParticipantsIsChecked && (
                  <TextField
                    type="number"
                    value={maxNumberOfParticipants}
                    label="Max number of participants"
                    variant="outlined"
                    onChange={(event) => {
                      const input = event.target.value;
                      if (isNaN(parseInt(input))) {
                        setMaxNumberOfParticipants(1);
                      } else {
                        setMaxNumberOfParticipants(parseInt(input));
                      }
                    }}
                    sx={{ width: 1 / 2, my: 2 }}
                  />
                )}
              </Box>
            )}

            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Enter date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                Click the camera to upload an image
              </Typography>

              <Box sx={{ ml: 1 }}>
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={(event) => {
                      const input = event.target.files[0];
                      setPhotoToUpload(input);
                    }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload photo"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Button
                onClick={handleUpdateHike}
                sx={{ mr: 1 }}
                variant="contained"
                startIcon={<EditIcon />}
              >
                Update hike
              </Button>

              <Button
                onClick={handleDeleteHike}
                sx={{ ml: 1 }}
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Delete hike
              </Button>
            </Box>
          </Box>

          {downloadedPhoto.data && (
            <Box sx={ (width > 700) ? {
              px: 4,
              width: "60%",
              marginBottom: "0"
            } : { 
              width: "100%",
              marginBottom: "1em"
            }}>
              <Image
                src={`${BACKEND_URL}${downloadedPhoto.data.attributes.url}`}
                height={ (width > 700) ? downloadedPhoto.data.attributes.height : "250px"}
                width={downloadedPhoto.data.attributes.width}
                objectFit="cover"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const id = context.params.id;

  const userId = getUserIdFromJwtOrUndefined(context);
  if (!userId) {
    return { redirect: { destination: "/", permanent: false } };
  }

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
export default UpdateHike;
