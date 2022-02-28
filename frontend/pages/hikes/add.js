import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
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

const Add = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);

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
          sx={{ width: 1 / 4, my: 2 }}
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
          sx={{ width: 1 / 2, my: 2 }}
        />

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
                  console.log(input);

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
          sx={{ width: 1 / 6 }}
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
  const userId = getUserIdFromJwtOrUndefined();

  if (!userId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
};

export default Add;
