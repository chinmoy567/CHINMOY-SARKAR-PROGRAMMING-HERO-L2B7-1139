import express from "express";

import auth from "../../middleware/auth";
import { createIssue, getIssues, getSingleIssue } from "./issues.controller";

const router = express.Router();

router.post("/", auth(), createIssue);
router.get("/", getIssues);
router.get("/:id", getSingleIssue);

export default router;
