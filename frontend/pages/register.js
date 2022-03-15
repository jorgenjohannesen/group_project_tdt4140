import axios from "axios";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { BACKEND_URL, STATUS } from "../utils/constants";
import Alert from "@mui/material/Alert";
import isEmpty from "../utils/isEmpty";
import capitalize from "../utils/capitalize";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import Link from "@mui/material/Link";
import { setJwtIfDefined } from "../lib/jwt";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCommercial, setIsCommercial] = useState(false);
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);

  /**
   * Handles the action of registering a new user on click.
   */
  const handleSubmit = async () => {
    // Check that user input is not empty
    if (isEmpty(username) || isEmpty(email) || isEmpty(password)) {
      setFeedback("All input fields must be filled in.");
      return;
    }

    // This is the payload to send in the POST request to the backend
    const payload = {
      username: username,
      email: email,
      password: password,
      isCommercial: isCommercial,
    };

    // POST user to backend
    await axios
      .post(`${BACKEND_URL}/api/auth/local/register`, payload)
      .then((response) => {
        setJwtIfDefined(response);
        setStatusCode(response.status);
        setFeedback("Success! User created.");
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;

        setStatusCode(error.response.status);

        if (
          errorMessage
            .toLowerCase()
            .includes("error occurred during account creation")
        ) {
          setFeedback("Oops! Username is already taken.");
        } else {
          setFeedback(`Oops! ${capitalize(errorMessage)}.`);
        }
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

      <FormControl
        sx={{
          display: "flex",
          width: "65%",
          mx: "auto",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ p: 1 }}>
          Register new user
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          required
          onChange={(event) => {
            const input = event.target.value;
            setUsername(input);
          }}
          sx={{ m: 1 }}
          data-cy="input-username"
        />

        <TextField
          label="E-mail"
          variant="outlined"
          type="email"
          required
          onChange={(event) => {
            const input = event.target.value;
            setEmail(input);
          }}
          sx={{ m: 1 }}
          data-cy="input-email"
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(event) => {
            const input = event.target.value;
            setPassword(input);
          }}
          sx={{ m: 1 }}
          data-cy="input-password"
        />
        <FormControlLabel
          labelPlacement='start'
          sx={{ mr: 1 }}
          control={<Checkbox defaultUnchecked
            data-cy="checkbox-commercial"
          />}
          label="Are you a commercial user?"
          onChange={(event) => {
            const isChecked = event.target.checked;
            setIsCommercial(isChecked)
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ m: 1 }}
          data-cy="submit-button"
        >
          Register
        </Button>

        <Box sx={{ mx: "auto", py: 1 }}>
          <Typography>
            Already have an account?{" "}
            <Link href="/login" data-cy="login-link">
              Click here to login.
            </Link>
          </Typography>
        </Box>
      </FormControl>
    </Box>
  );
};

export default Register;
