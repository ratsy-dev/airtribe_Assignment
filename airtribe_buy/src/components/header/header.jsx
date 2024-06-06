import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { Box, LinearProgress } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { doc, getDoc } from "firebase/firestore";
import { useData } from "../context/context";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 13,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function Header() {
  const navigate = useNavigate();
  const { wishlistCount, cartCount } = useData();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setLoading(localStorage.getItem("progress"));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setLoading(localStorage.getItem("progress") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const getUserlist = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "User", auth.currentUser.uid);
        try {
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            localStorage.setItem("progress", false);
            window.dispatchEvent(new Event("storage"));
          } else {
            console.error("User document not found!");
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        console.error("User is not authenticated!");
      }
    };

    getUserlist();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserlist();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate("/products");
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cartHandler = () => {
    localStorage.setItem("progress", true);
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
  };

  const wishlistHandler = () => {
    localStorage.setItem("progress", true);
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      navigate("/wishlist");
    }, 1000);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "background.paper" }}>
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
              border: "none",
              outline: "none",
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
                onClick={() => navigate("/register")}
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
              <IconButton
                aria-label="cart"
                onClick={() => cartHandler()}
                sx={{
                  color: "secondary.main",
                  border: "none",
                  "&:hover": {
                    borderWidth: 0,
                    backgroundColor: "inherit",
                  },
                }}
              >
                <StyledBadge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon
                    style={{
                      color: "red",
                      fontSize: "2rem",
                    }}
                  />
                </StyledBadge>
              </IconButton>
              <IconButton
                aria-label="cart"
                onClick={() => wishlistHandler()}
                sx={{
                  marginRight: 1,
                  border: "none",
                  color: "primary.main",
                  "&:hover": {
                    borderWidth: 0,
                    backgroundColor: "inherit",
                  },
                }}
              >
                <StyledBadge badgeContent={wishlistCount} color="secondary">
                  <ContentPasteIcon
                    style={{
                      color: "navy",
                      fontSize: "2rem",
                    }}
                  />
                </StyledBadge>
              </IconButton>
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
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
    </Box>
  );
}

export default Header;
