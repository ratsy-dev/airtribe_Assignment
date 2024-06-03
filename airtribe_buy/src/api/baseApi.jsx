import axios from "axios";

const token = localStorage.getItem("token");

const AIRTRIBE_API = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ? token : null}`,
  },
});

export default AIRTRIBE_API;
