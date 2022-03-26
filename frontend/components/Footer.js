import BottomNavigation from "@mui/material/BottomNavigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 2,
        bottom: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography>Developed by Group 69</Typography>
    </Box>
  );
};

export default Footer;
