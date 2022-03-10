import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { getUserIdFromJwtOrUndefined } from "../lib/jwt";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/router";

const pages = [
  // "Hikes",
  // "Pricing",
  // "Blog"
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userIsLoggedIn, setUserIsLogggedIn] = useState(false);
  const [userId, setUserId] = useState(undefined);

  const settings = [
    { label: "Your profile", href: `/users/${userId}` },
    // "Account",
    { label: "Logout", href: "/logout" },
  ];

  const router = useRouter();
  // Set userId when page loads
  useEffect(() => {
    const userId = getUserIdFromJwtOrUndefined();
    setUserId(userId);

    if (userId) {
      setUserIsLogggedIn(true);
      return;
    }

    setUserIsLogggedIn(false);
  }, [router]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                "&:hover": { cursor: "pointer", color: "darkgrey" },
              }}
            >
              HikeLink
            </Typography>
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            HikeLink
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ pr: 4 }}>
            {userIsLoggedIn ? (
              <Link href="/hikes/add">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "lightgray",
                    color: "black",
                    "&:hover": { backgroundColor: "white" },
                  }}
                  startIcon={<AddIcon />}
                >
                  Add hike
                </Button>
              </Link>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Link href="/login">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "lightgray",
                      color: "black",
                      mx: 1,
                      "&:hover": { backgroundColor: "white" },
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "lightgray",
                      mx: 1,
                      color: "black",
                      "&:hover": { backgroundColor: "white" },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Register
                  </Button>
                </Link>
              </Box>
            )}
          </Box>

          {userId && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Link href={setting.href}>
                      <Typography textAlign="center">
                        {setting.label}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
