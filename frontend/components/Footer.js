import BottomNavigation from "@mui/material/BottomNavigation";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <BottomNavigation
      sx={{ py: 2, position: "fixed", bottom: 0, width: "100%", mx: "auto" }}
    >
      <Typography>Developed by Group 69</Typography>
    </BottomNavigation>
  );
};

export default Footer;
