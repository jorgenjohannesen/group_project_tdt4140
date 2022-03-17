import { Grow } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

const Footer = () => {
  return (
    <BottomNavigation
      sx={{
        py: 2,
        width: "100%",
        mx: "auto",
      }}
    >
      <Typography>Developed by Group 69</Typography>
    </BottomNavigation>
  );
};

export default Footer;
