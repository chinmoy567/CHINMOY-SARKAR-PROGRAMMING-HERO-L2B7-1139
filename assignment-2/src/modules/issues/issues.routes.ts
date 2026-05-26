import express from "express";

import auth from "../../middleware/auth";
import { createIssue } from "./issues.controller";

const router = express.Router();

router.post("/", auth(), createIssue);

export default router;
