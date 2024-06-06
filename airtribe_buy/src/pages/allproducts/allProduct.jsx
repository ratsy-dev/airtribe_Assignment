import React, { useState, useEffect } from "react";
import AIRTRIBE_API from "../../api/baseApi";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Tooltip,
  Button,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useData } from "../../components/context/context";

const AllProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const { setWishlistCount, setCartCount } = useData();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await AIRTRIBE_API.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error.message || "Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishList = async (event, id) => {
    event.stopPropagation();
    if (!token) {
      toast.info("Please login for adding a product to the wishlist ");
      return;
    } else {
      const userRef = doc(db, "User", auth.currentUser.uid);
      let userData;

      try {
        const userSnapshot = await getDoc(userRef);
        userData = userSnapshot.data();

        if (!userData) {
          console.error("User document not found!");
          toast.error("An error occurred. Please try again later.");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred. Please try again later.");
        return;
      }

      let productData;
      try {
        const response = await AIRTRIBE_API.get(`/products/${id}`);
        productData = response.data;
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details. Please try again later.");
        return;
      }

      if (
        userData.wishlist &&
        userData.wishlist.some((item) => item.id === id)
      ) {
        toast.info("Item already exists in wishlist");
        return;
      }

      const newWishlist = userData.wishlist
        ? [...userData.wishlist, productData]
        : [productData];
      try {
        await setDoc(userRef, { wishlist: newWishlist }, { merge: true });
        setWishlistCount((prevCount) => prevCount + 1);
        toast.success("Product added to wishlist");
      } catch (error) {
        console.error("Error updating wishlist:", error);
        toast.error(
          "An error occurred while adding to the wishlist. Please try again."
        );
      }
    }
  };

  const handleCart = async (event, id) => {
    event.stopPropagation();
    if (!token) {
      toast.info("Please login for adding a product to the wishlist ");
      return;
    } else {
      const userRef = doc(db, "User", auth.currentUser.uid);
      let userData;

      try {
        const userSnapshot = await getDoc(userRef);
        userData = userSnapshot.data();

        if (!userData) {
          console.error("User document not found!");
          toast.error("An error occurred. Please try again later.");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred. Please try again later.");
        return;
      }

      let productData;
      try {
        const response = await AIRTRIBE_API.get(`/products/${id}`);
        productData = response.data;
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details. Please try again later.");
        return;
      }

      if (userData.cart && userData.cart.some((item) => item.id === id)) {
        toast.info("Item already exists in cartlist");

        return;
      }

      const newCart = userData.cart
        ? [...userData.cart, productData]
        : [productData];
      try {
        await setDoc(userRef, { cart: newCart }, { merge: true });
        setCartCount((prevCount) => prevCount + 1); // Update the context state
        toast.success("Product added to cart");
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error(
          "An error occurred while adding to the cart. Please try again."
        );
      }
    }
  };

  const handleProductDetail = async (id) => {
    localStorage.setItem("progress", true);
    window.dispatchEvent(new Event("storage"));
    try {
      const response = await AIRTRIBE_API.get(`/products/${id}`);
      const product = response.data;
      navigate(`/products/${id}`, { state: { product } });
    } catch (error) {
      localStorage.setItem("progress", false);
      window.dispatchEvent(new Event("storage"));
      console.error(error.message || "Error fetching products");
    }
  };

  const skeletonArray = new Array(8).fill(0);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "2rem 0",
            mt: 8,
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
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "2rem 0",
            mt: 8,
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              onClick={(id) => handleProductDetail(product.id)}
              sx={{
                border: "none",
                cursor: "pointer",
                margin: "20px",
                width: "300px",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: "contain" }}
                image={product.image}
                title="card_img"
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" component="p" alignSelf="center">
                  {product.title.split(",")[0]}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  alignSelf="center"
                  mt={1}
                  sx={{ fontSize: 18, fontWeight: "bold", color: "navy" }}
                >
                  ${product.price}
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Rating
                    name="read-only"
                    value={product.rating.rate}
                    readOnly
                  />
                  <Button
                    onClick={(event) => handleWishList(event, product.id)}
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
                <Box
                  sx={{
                    mt: 5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(event) => handleCart(event, product.id)}
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
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
};

export default AllProductPage;
