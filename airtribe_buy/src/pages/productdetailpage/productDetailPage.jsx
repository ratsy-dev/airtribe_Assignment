import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Tooltip,
  Button,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Skeleton from "@mui/material/Skeleton";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const location = useLocation();
  const product = location.state.product;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("progress", false);
      window.dispatchEvent(new Event("storage"));
    }, 1000);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  const handleWishList = () => {
    if (!token) {
      toast.error("Please login for wishlisting a product");
    }
  };

  const handleCart = () => {
    if (!token) {
      toast.error("Please login for adding a product to the cart");
    }
  };

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

        <Typography color="text.primary">Product</Typography>
      </Breadcrumbs>
      {product ? (
        <>
          <Grid container sx={{ mt: 3 }}>
            <Grid
              item
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              xs={12}
              md={3}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 300,
                    margin: "10px",
                  }}
                >
                  <Skeleton
                    sx={{ bgcolor: "#ccc", borderRadius: 5 }}
                    variant="rectangular"
                    width={200}
                    height={200}
                    animation="wave"
                  />
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={product.image}
                  alt="product image"
                  sx={{ height: 200, objectFit: "contain" }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={1}>
              <Divider
                orientation="vertical"
                variant="fullWidth"
                sx={{ height: "100%", bgcolor: "#ccc", width: 3 }}
              />
            </Grid>

            <Grid item container direction="column" xs={12} md={4}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 300,
                    margin: "10px",
                  }}
                >
                  <Box sx={{ pt: 0.5, width: "100%" }}>
                    <Skeleton width="100%" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Skeleton width="40%" />
                      <Skeleton width="40%" sx={{ marginLeft: "1rem" }} />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Skeleton width="15%" />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Skeleton width="60%" />
                      <Skeleton width="20%" sx={{ marginLeft: "1rem" }} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <CardContent>
                  <Typography
                    textAlign="center"
                    variant="h5"
                    component="p"
                    alignSelf="center"
                    sx={{ fontWeight: 500 }}
                  >
                    {product.title.split(",")[0]}
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      name="read-only"
                      value={product.rating.rate}
                      readOnly
                    />
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ fontWeight: 500, marginLeft: "1rem" }}
                    >
                      {product.rating.count} Ratings
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="p"
                      alignSelf="center"
                      mt={1}
                      sx={{ fontSize: 18, fontWeight: "bold", color: "navy" }}
                    >
                      ${product.price}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleCart()}
                      sx={{
                        borderColor: "secondary.main",
                        color: "secondary.main",
                      }}
                    >
                      <ShoppingCartIcon
                        style={{
                          color: "red",
                          fontSize: "1.6rem",
                          marginRight: "0.5rem",
                        }}
                      />
                      Add to cart
                    </Button>
                    <Button
                      onClick={() => handleWishList()}
                      style={{
                        border: "none",
                        outline: "none",
                        background: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <Tooltip title="Add to Wishlist">
                        <FavoriteIcon
                          style={{ color: "red", fontSize: "1.6rem" }}
                        />
                      </Tooltip>
                    </Button>
                  </Box>
                </CardContent>
              )}
            </Grid>
          </Grid>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                mt: 3,
                p: 3,
                minWidth: "60%",
                alignSelf: "center",
              }}
            >
              <Skeleton width="100%" />
              <Skeleton width="100%" />
            </Box>
          ) : (
            <Box
              boxShadow="base"
              rounded="md"
              border="1px solid"
              borderColor="#ccc"
              sx={{ mt: 3, p: 3, minWidth: "60%", alignSelf: "center" }}
            >
              <Typography
                variant="body1"
                component="p"
                alignSelf="center"
                color="#808080"
              >
                Description: {product.description}
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body1" component="p" alignSelf="center">
          No Product Found
        </Typography>
      )}
    </Box>
  );
};

export default ProductDetailPage;
