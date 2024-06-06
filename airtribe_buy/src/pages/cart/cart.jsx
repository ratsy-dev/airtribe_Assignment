import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
  Select,
  MenuItem,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const TAX_RATE = 0.07;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function CartPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (event, productId) => {
    setQuantities({ ...quantities, [productId]: event.target.value });
  };

  useEffect(() => {
    setLoading(true);
    const getUserWishlist = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "User", auth.currentUser.uid);
        try {
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            setProducts(userData.cart || []);
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

  const invoiceSubtotal = products.reduce(
    (acc, product) => acc + product.price * (quantities[product.id] || 1),
    0
  );

  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceSubtotal + invoiceTaxes;

  return (
    <Box p={3} mt={10}>
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

        <Typography color="text.primary">Cart</Typography>
      </Breadcrumbs>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            margin: "10px",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="90%"
            height={400}
            animation="wave"
          />
        </Box>
      ) : !products || products?.length == 0 ? (
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
            No Products in cart
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={5}
          sx={{ width: "95%", margin: "3rem auto" }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  Details
                </TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Desc</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell align="right">
                    <Select
                      value={quantities[product.id] || 1}
                      onChange={(event) =>
                        handleQuantityChange(event, product.id)
                      }
                    >
                      {[...Array(10).keys()].map((num) => (
                        <MenuItem key={num + 1} value={num + 1}>
                          {num + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">
                    {ccyFormat(product.price * (quantities[product.id] || 1))}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">
                  {ccyFormat(invoiceSubtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
                  0
                )} %`}</TableCell>
                <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CartPage;
