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

const Input = styled("input")({
  display: "none",
});

const UpdateHike = ({ hike }) => {
  console.log(hike);

  const {
    id: hikeId,
    attributes: {
      title: hikeTitle,
      description: hikeDescription,
      photo: hikePhoto,
      price: hikePrice,
      ownedBy: {
        data: {
          attributes: { username, isCommercial },
          id: ownerId,
        },
      },
    },
  } = hike;

  console.log(isCommercial);

  const router = useRouter();

  const [title, setTitle] = useState(hikeTitle);
  const [description, setDescription] = useState(hikeDescription);
  const [price, setPrice] = useState(hikePrice);
  const [downloadedPhoto, _] = useState(hikePhoto);
  const [photoToUpload, setPhotoToUpload] = useState(undefined);
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);

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
            <Box sx={{ px: 4, width: "60%" }}>
              <Image
                src={`${BACKEND_URL}${downloadedPhoto.data.attributes.url}`}
                height={downloadedPhoto.data.attributes.height}
                width={downloadedPhoto.data.attributes.width}
                object-fit="cover"
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
