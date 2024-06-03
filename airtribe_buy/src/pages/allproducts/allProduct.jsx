import React, { useState, useEffect } from "react";
import AIRTRIBE_API from "../../api/baseApi";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const AllProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
          }}
        >
          {products.map((product) => (
            <Card
              raised
              key={product.id}
              sx={{
                margin: "10px",
                width: "300px",
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
                <Typography
                  variant="body1"
                  component="p"
                  alignSelf="center"
                  sx={{ fontWeight: 500 }}
                >
                  {product.title.split(",")[0]}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  alignSelf="center"
                  mt={3}
                  sx={{ fontWeight: 500 }}
                >
                  Price: {product.price}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
};

export default AllProductPage;
