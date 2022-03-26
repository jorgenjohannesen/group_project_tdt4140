import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
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
import { useEffect, useState } from "react";
import { BACKEND_URL, STATUS } from "../../utils/constants";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import isEmpty from "../../utils/isEmpty";
import capitalize from "../../utils/capitalize";
import Typography from "@mui/material/Typography";
import { getUserIdFromJwtOrUndefined } from "../../lib/jwt";

const Input = styled("input")({
  display: "none",
});

const Add = ({ owner }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusCode, setStatusCode] = useState(-1);
  const [difficulty, setDifficulty] = useState("");
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [
    maxNumberOfParticipantsIsChecked,
    setMaxNumberOfParticipantsIsChecked,
  ] = useState(false);
  const [maxNumberOfParticipants, setMaxNumberOfParticipants] = useState(undefined);
  const [date, setDate] = useState(null);

  const handleSubmit = async () => {
    // Check that user input is not empty
    if (isEmpty(title) || isEmpty(description)) {
      setFeedback("All input fields must be filled in.");
      return;
    }

    const payload = {
      data: {
        title: title,
        description: description,
        price: price,
        date: date,
        ownedBy: getUserIdFromJwtOrUndefined(),
        maxNumberOfParticipants: maxNumberOfParticipants,
        difficulty: difficulty,
      },
    };

    if (!photo) {
      // POST hike payload
      await axios
        .post(`${BACKEND_URL}/api/hikes`, payload)
        .then((response) => {
          setStatusCode(response.status);
        })
        .catch((error) => {
          const errorMessage = error.response.data.error.message;
          setStatusCode(error.response.status);
          setFeedback(`Oops! ${capitalize(errorMessage)}`);
        });
    } else {
      const file = new FormData();
      file.append("files", photo);

      // POST photo
      await axios
        .post(`${BACKEND_URL}/api/upload`, file)
        .then((response) => {
          const id = response.data[0].id;

          // POST photo ID to an existing hike
          axios
            .post(`${BACKEND_URL}/api/hikes`, {
              data: { ...payload.data, photo: id },
            })
            .then((response) => {
              setStatusCode(response.status);
            })
            .catch((error) => {
              const errorMessage = error.response.data.error.message;
              setStatusCode(error.response.status);
              setFeedback(`Oops! ${capitalize(errorMessage)}`);
            });
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
      setFeedback("Successfully created hike!");
    } else if (statusCode === STATUS.BAD_REQUEST) {
      setSeverity("error");
    } else {
      setSeverity("warning");
    }
  }, [statusCode]);

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ width: "75%", display: "flex", flexDirection: "column" }}>
        {feedback && (
          <Alert
            severity={severity}
            sx={{ width: "65%", mx: "auto", my: 2 }}
            data-cy="alert"
          >
            {feedback}
          </Alert>
        )}

        <Typography variant="h4" sx={{ p: 1 }}>
          Add a new hike
        </Typography>
        <TextField
          required
          label="Title"
          variant="outlined"
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
          rows={6}
          variant="outlined"
          onChange={(event) => {
            const input = event.target.value;
            setDescription(input);
          }}
          sx={{ my: 2 }}
        />
        <FormControl required>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Difficulty
          </FormLabel>
          <RadioGroup
            row
            difficulty={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value);
            }}
          >
            <FormControlLabel value="easy" control={<Radio />} label="Easy" />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            <FormControlLabel value="none" control={<Radio />} label="None" />
          </RadioGroup>
        </FormControl>

        <FormGroup sx={{ margin: 1 }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Check to set a maximum number of participants"
            onChange={(event) => {
              const input = event.target.checked;
              setMaxNumberOfParticipantsIsChecked(input);
              setMaxNumberOfParticipants(null);
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

        {owner.isCommercial && (
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

        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              renderInput={(props) => <TextField {...props} />}
              label="Enter date *"
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
                  setPhoto(input);
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

        <Button
          onClick={handleSubmit}
          sx={{ my: 2 }}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add hike
        </Button>
      </Box>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const userId = getUserIdFromJwtOrUndefined(context);

  if (!userId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const response = await fetch(`${BACKEND_URL}/api/users/${userId}`);
  const owner = await response.json();

  return { props: { owner } };
};

export default Add;
