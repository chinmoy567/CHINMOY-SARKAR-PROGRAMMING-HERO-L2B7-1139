

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express3 from "express";
import cors from "cors";

// src/modules/auth/auth.routes.ts
import express from "express";

// src/modules/auth/auth.controller.ts
import { StatusCodes } from "http-status-codes";

// src/utils/sendResponse.ts
var sendResponse = (res, statusCode, success, message, data) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT,
  database_connection_string: process.env.DATABASE_CONNECTION_STRING,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.database_connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,

        role VARCHAR(20)
          DEFAULT 'contributor'
          CHECK (role IN ('contributor', 'maintainer')),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,

        title VARCHAR(150) NOT NULL,

        description TEXT NOT NULL
          CHECK (LENGTH(description) >= 20),

        type VARCHAR(30) NOT NULL
          CHECK (type IN ('bug', 'feature_request')),

        status VARCHAR(30)
          DEFAULT 'open'
          CHECK (status IN ('open', 'in_progress', 'resolved')),

        reporter_id INTEGER NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.log(error);
  }
};

// src/modules/auth/auth.service.ts
var signupUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `
      INSERT INTO users(
        name,
        email,
        password,
        role
      )
      VALUES($1,$2,$3,$4)

      RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    `,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};
var loginUserFromDB = async (payload) => {
  const { email, password } = payload;
  const result = await pool.query(
    `
      SELECT * FROM users
      WHERE email=$1
    `,
    [email]
  );
  const user = result.rows[0];
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    const error = new Error("Password or email does not match");
    error.statusCode = 400;
    throw error;
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role
    },
    config_default.jwt_access_secret,
    {
      expiresIn: "365d"
    }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
};

// src/modules/auth/auth.controller.ts
var signupUser = async (req, res, next) => {
  try {
    const result = await signupUserIntoDB(req.body);
    sendResponse_default(
      res,
      StatusCodes.CREATED,
      true,
      "User registered successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
var loginUser = async (req, res, next) => {
  try {
    const result = await loginUserFromDB(req.body);
    sendResponse_default(res, StatusCodes.OK, true, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

// src/modules/auth/auth.routes.ts
var router = express.Router();
router.post("/signup", signupUser);
router.post("/login", loginUser);
var auth_routes_default = router;

// src/modules/issues/issues.routes.ts
import express2 from "express";

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var auth = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendResponse_default(res, 401, false, "Unauthorized access");
        return;
      }
      const decoded = jwt2.verify(token, config_default.jwt_access_secret);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        sendResponse_default(res, 403, false, "Forbidden access");
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/modules/issues/issues.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";

// src/modules/issues/issues.service.ts
var createIssueIntoDB = async (payload, reporter_id) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
      INSERT INTO issues(
        title,
        description,
        type,
        reporter_id
      )

      VALUES($1,$2,$3,$4)

      RETURNING
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
    `,
    [title, description, type, reporter_id]
  );
  return result.rows[0];
};
var getIssuesFromDB = async (query) => {
  const { type, status, sort } = query;
  let sql = `
    SELECT *
    FROM issues
  `;
  const conditions = [];
  if (type) {
    conditions.push(`type='${type}'`);
  }
  if (status) {
    conditions.push(`status='${status}'`);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }
  if (sort === "newest") {
    sql += ` ORDER BY created_at DESC`;
  }
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  }
  const result = await pool.query(sql);
  return result.rows;
};
var getSingleIssueFromDB = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id]
  );
  const issue = result.rows[0];
  if (!issue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }
  return issue;
};
var updateIssueIntoDB = async (id, payload, user) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      const error = new Error("You can update only your own issue");
      error.statusCode = 403;
      throw error;
    }
    if (issue.status !== "open") {
      const error = new Error("Only open issues can be updated");
      error.statusCode = 409;
      throw error;
    }
  }
  const { title, description, type } = payload;
  const result = await pool.query(
    `
      UPDATE issues
      SET
        title=COALESCE($1,title),
        description=COALESCE($2,description),
        type=COALESCE($3,type),
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$4
      RETURNING *
    `,
    [title, description, type, id]
  );
  return result.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }
  await pool.query(
    `
      DELETE FROM issues
      WHERE id=$1
    `,
    [id]
  );
};

// src/modules/issues/issues.controller.ts
var createIssue = async (req, res, next) => {
  try {
    const result = await createIssueIntoDB(req.body, req.user.id);
    sendResponse_default(
      res,
      StatusCodes2.CREATED,
      true,
      "Issue created successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
var getIssues = async (req, res, next) => {
  try {
    const result = await getIssuesFromDB(req.query);
    sendResponse_default(
      res,
      StatusCodes2.OK,
      true,
      "Issues retrieved successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
var getSingleIssue = async (req, res, next) => {
  try {
    const result = await getSingleIssueFromDB(Number(req.params.id));
    sendResponse_default(
      res,
      StatusCodes2.OK,
      true,
      "Issue retrieved successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
var updateIssue = async (req, res, next) => {
  try {
    const result = await updateIssueIntoDB(
      Number(req.params.id),
      req.body,
      req.user
    );
    sendResponse_default(
      res,
      StatusCodes2.OK,
      true,
      "Issue updated successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};
var deleteIssue = async (req, res, next) => {
  try {
    await deleteIssueFromDB(Number(req.params.id));
    sendResponse_default(res, StatusCodes2.OK, true, "Issue deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/issues/issues.routes.ts
var router2 = express2.Router();
router2.post("/", auth_default(), createIssue);
router2.get("/", getIssues);
router2.get("/:id", getSingleIssue);
router2.patch("/:id", auth_default("contributor", "maintainer"), updateIssue);
router2.delete("/:id", auth_default("maintainer"), deleteIssue);
var issues_routes_default = router2;

// src/middleware/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found"
  });
};
var notFound_default = notFound;

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express3();
app.use(cors());
app.use(express3.json());
app.use(express3.text());
app.use(express3.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("CHINMOY SARKAR PROGRAMMING HERO L2B7-1139 ASSIGNMENT-2");
});
app.use("/api/auth", auth_routes_default);
app.use("/api/issues", issues_routes_default);
app.use(globalErrorHandler_default);
app.use(notFound_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`Server is running on http://localhost:${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map