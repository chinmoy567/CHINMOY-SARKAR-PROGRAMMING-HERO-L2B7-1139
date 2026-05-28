import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import issueRoutes from "./modules/issues/issues.routes";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(
    "CHINMOY  SARKAR  PROGRAMMING  HERO L2B7-1139  ASSIGNMENT-2 (Bug & Feature Tracking System)",
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
