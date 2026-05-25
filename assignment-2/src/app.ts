import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("CHINMOY SARKAR PROGRAMMING HERO L2B7-1139 ASSIGNMENT-2");
});

export default app;