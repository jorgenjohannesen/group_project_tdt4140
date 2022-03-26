import sleep from "../utils/sleep";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  BACKEND_URL,
  STATUS,
  DELAY_BEFORE_REROUTING_IN_MS,
} from "../utils/constants";
import Alert from "@mui/material/Alert";
import isEmpty from "../utils/isEmpty";
import capitalize from "../utils/capitalize";
import { Box, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { useRouter } from "next/dist/client/router";
import redirectIfAuthenticated from "../lib/redirectIfAuthenticated";
import { setJwtIfDefined } from "../lib/jwt";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [statusCode, setStatusCode] = useState(-1);
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);

  const router = useRouter();

  /**
   * Handles the action of logging in an existing user on click.
   */
  const handleSubmit = async () => {
    // Check that user input is not empty
    if (isEmpty(identifier) || isEmpty(password)) {
      setFeedback("All input fields must be filled in.");
      return;
    }

    // This is the payload to send in the POST request to the backend
    const payload = {
      identifier: identifier,
      password: password,
    };

    // POST user to backend
    await axios
      .post(`${BACKEND_URL}/api/auth/local`, payload)
      .then((response) => {
        setJwtIfDefined(response);
        setStatusCode(response.status);
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;

        setStatusCode(error.response.status);
        setFeedback(`Oops! ${capitalize(errorMessage)}.`);
      });
  };

  useEffect(() => {
    if (statusCode === STATUS.OK) {
      setSeverity("success");
      setFeedback(
        "Successfully logged in. You will now be taken to the homepage."
      );

      // Wait for provided time, and then route user to the index page
      sleep(DELAY_BEFORE_REROUTING_IN_MS).then(() => router.push("/"));
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
          Login user
        </Typography>

        <TextField
          label="Username or e-mail"
          variant="outlined"
          required
          onChange={(event) => {
            const input = event.target.value;
            setIdentifier(input);
          }}
          sx={{ m: 1 }}
          data-cy="input-identifier"
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ m: 1 }}
          data-cy="submit-button"
        >
          Login
        </Button>

        <Box sx={{ mx: "auto", py: 1 }}>
          <Typography>
            Don't have an account?{" "}
            <Link href="/register" data-cy="register-link">
              Register a new user.
            </Link>
          </Typography>
        </Box>
      </FormControl>
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  return redirectIfAuthenticated(context);
};

export default Login;
