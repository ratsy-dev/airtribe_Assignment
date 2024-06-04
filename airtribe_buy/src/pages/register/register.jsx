import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [loading, setLoading] = useState(false);

  const registerHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      let user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "User", user.uid), {
          email: user.email,
          firstName: fName,
          lastName: lName,
          contactNumber: contactNum,
          wishlist_products: null,
          cartlist_products: null,
        });

        navigate("/login");
        toast.success("User registered Successfully");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={registerHandler}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="fName"
              label="First Name"
              type="text"
              id="fName"
              autoComplete="fName"
              autoFocus
              value={fName}
              onChange={(e) => setFName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lName"
              label="Last Name"
              type="text"
              id="lName"
              autoComplete="lName"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contact_num"
              label="Contact Number"
              type="number"
              id="contact_num"
              autoComplete="contact_num"
              value={contactNum}
              onChange={(e) => setContactNum(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: "40px" }}
            >
              {loading ? (
                <CircularProgress
                  style={{ color: "#fff", width: 24, height: 24 }}
                />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </form>
  );
}

export default RegisterPage;
