import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "background.paper" }}>
        <Toolbar>
          <Typography
            color={"primary.main"}
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textTransform: "uppercase",
              fontWeight: 900,
              fontSize: "1.5rem",
            }}
          >
            <Link
              component={RouterLink}
              to="/products"
              variant="h5"
              underline="none"
            >
              {" Shopify"}
            </Link>
          </Typography>

          {!token ? (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{
                  marginRight: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="regColor"
                onClick={() => navigate("/login")}
                sx={{
                  marginRight: 1,
                  borderColor: "regColor.main",
                  color: "regColor.main",
                }}
              >
                Register
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{
                  marginRight: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                }}
              >
                WishList
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleLogout()}
                sx={{
                  borderColor: "secondary.main",
                  color: "secondary.main",
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
