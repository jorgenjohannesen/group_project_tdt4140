import BottomNavigation from "@mui/material/BottomNavigation";

const Footer = () => {
  return (
    <BottomNavigation
      sx={{ py: 2, position: "fixed", bottom: 0, width: "100%", mx: "auto" }}
    >
      <div>Developed by Group 69</div>
    </BottomNavigation>
  );
};

export default Footer;
