import React, { useState, useEffect } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Grid,
} from "@mui/material";

import Skeleton from "@mui/material/Skeleton";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const WishListPage = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getUserWishlist = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "User", auth.currentUser.uid);
        try {
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            setProducts(userData.wishlist_products || []);
            localStorage.setItem("progress", false);
            window.dispatchEvent(new Event("storage"));
            setLoading(false);
          } else {
            console.error("User document not found!");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          toast.error("An error occurred. Please try again later.");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("User is not authenticated!");
        setLoading(true);
      }
    };

    getUserWishlist();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserWishlist();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const skeletonArray = new Array(8).fill(0);

  console.log(auth.currentUser);

  return (
    <Box p={3}>
      <Breadcrumbs
        fontSize="md"
        spacing="8px"
        mb={6}
        color="gray.500"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <Link
          component={RouterLink}
          to="/products"
          variant="body1"
          underline="hover"
        >
          All Products
        </Link>

        <Typography color="text.primary">WishList</Typography>
      </Breadcrumbs>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "2rem 0",
          }}
        >
          {skeletonArray.map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 300,
                margin: "10px",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={300}
                height={200}
                animation="wave"
              />
              <Box sx={{ pt: 0.5, width: "100%" }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : !products ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: 30,
          }}
        >
          <Typography
            color={"primary.main"}
            variant="h6"
            component="div"
            sx={{
              textTransform: "uppercase",
              fontWeight: 900,
              fontSize: "1.5rem",
            }}
          >
            No Products
          </Typography>
        </Box>
      ) : (
        <Grid container direction="column" spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <Card sx={{ display: "flex", px: 3, py: 2 }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: 80,
                    height: 100,
                    objectFit: "contain",
                  }}
                  image={product.image}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1, marginLeft: 2 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1">{product.price}</Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      border: "none",
                      outline: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleLogout()}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        height: 30,
                      }}
                    >
                      Move to cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WishListPage;
