import { pool } from "../../db";
import type { TIssue } from "./issues.interface";

// create issue
export const createIssueIntoDB = async (
  payload: TIssue,
  reporter_id: number,
) => {
  const { title, description, type } = payload;

  // issue type validation
  const validTypes = ["bug", "feature_request"];
  if (!validTypes.includes(type)) {
    const error: any = new Error("Invalid issue type");
    error.statusCode = 400;
    throw error;
  }

  // title validation
  if (!title || title.length > 150) {
    const error: any = new Error(
      "Title is required and must be under 150 characters",
    );
    error.statusCode = 400;
    throw error;
  }

  // description validation
  if (!description || description.length < 20) {
    const error: any = new Error("Description must be at least 20 characters");
    error.statusCode = 400;
    throw error;
  }

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
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

// get issues
export const getIssuesFromDB = async (query: any) => {
  const { type, status, sort } = query;
  // sort validation
  const validSort = ["newest", "oldest"];

  // default sorting = newest
  if (sort && !validSort.includes(sort)) {
    const error: any = new Error("Invalid sort query");
    error.statusCode = 400;
    throw error;
  }
  // issue type validation
  const validTypes = ["bug", "feature_request"];
  if (type && !validTypes.includes(type)) {
    const error: any = new Error("Invalid issue type query");
    error.statusCode = 400;
    throw error;
  }
  // issue status validation
  const validStatus = ["open", "in_progress", "resolved"];
  if (status && !validStatus.includes(status)) {
    const error: any = new Error("Invalid status query");
    error.statusCode = 400;
    throw error;
  }
  // base sql
  let sql = `
    SELECT *
    FROM issues
  `;
  const conditions: string[] = [];
  // filtering
  if (type) {
    conditions.push(`type='${type}'`);
  }
  if (status) {
    conditions.push(`status='${status}'`);
  }
  // add WHERE condition
  if (conditions.length > 0) {
    sql += `
      WHERE
      ${conditions.join(" AND ")}
    `;
  }
  // default sorting = newest
  if (!sort || sort === "newest") {
    sql += `
      ORDER BY created_at DESC
    `;
  }
  // oldest sorting
  if (sort === "oldest") {
    sql += `
      ORDER BY created_at ASC
    `;
  }
  // execute query
  const result = await pool.query(sql);
  const issues = result.rows;
  // add reporter object
  for (const issue of issues) {
    const reporterResult = await pool.query(
      `
          SELECT
            id,
            name,
            role
          FROM users
          WHERE id=$1
        `,
      [issue.reporter_id],
    );
    issue.reporter = reporterResult.rows[0];
    // remove reporter_id
    delete issue.reporter_id;
  }

  return issues;
};

// get single issue
export const getSingleIssueFromDB = async (id: number) => {
  // get issue
  const result = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id],
  );

  const issue = result.rows[0];

  // issue not found
  if (!issue) {
    const error: any = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  // get reporter info
  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id=$1
    `,
    [issue.reporter_id],
  );

  // add reporter object
  issue.reporter = reporterResult.rows[0];

  // remove reporter_id
  delete issue.reporter_id;

  return issue;
};

// update issue
export const updateIssueIntoDB = async (
  id: number,
  payload: Partial<TIssue>,
  user: {
    id: number;
    role: string;
  },
) => {
  // find issue by id
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id],
  );

  const issue = issueResult.rows[0];
  // issue not found
  if (!issue) {
    const error: any = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  // contributor permission checking
  if (user.role === "contributor") {
    // contributor can update only own issue
    if (issue.reporter_id !== user.id) {
      const error: any = new Error("You can update only your own issue");
      error.statusCode = 403;
      throw error;
    }

    // contributor can update only open issue
    if (issue.status !== "open") {
      const error: any = new Error(
        "You cannot edit resolved or in-progress issues",
      );
      error.statusCode = 409;
      throw error;
    }
  }
  // get update data from payload
  const { title, description, type, status } = payload;
  // issue type validation
  const validTypes = ["bug", "feature_request"];
  if (type && !validTypes.includes(type)) {
    const error: any = new Error("Invalid issue type");
    error.statusCode = 400;
    throw error;
  }
  // issue status validation
  const validStatus = ["open", "in_progress", "resolved"];
  if (status && !validStatus.includes(status)) {
    const error: any = new Error("Invalid status");
    error.statusCode = 400;
    throw error;
  }
  // title validation
  if (title && title.length > 150) {
    const error: any = new Error("Title must be under 150 characters");
    error.statusCode = 400;
    throw error;
  }

  // description validation
  if (description && description.length < 20) {
    const error: any = new Error("Description must be at least 20 characters");
    error.statusCode = 400;
    throw error;
  }

  // update issue in database
  const result = await pool.query(
    `
      UPDATE issues
      SET
        title=COALESCE($1,title),
        description=COALESCE($2,description),
        type=COALESCE($3,type),
        status=COALESCE($4,status),
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$5
      RETURNING *
    `,
    [title, description, type, status, id],
  );
  return result.rows[0];
};

// delete issue
export const deleteIssueFromDB = async (id: number) => {
  // check issue exists
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id=$1
    `,
    [id],
  );
  const issue = issueResult.rows[0];

  // issue not found
  if (!issue) {
    const error: any = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  // delete issue
  await pool.query(
    `
      DELETE FROM issues
      WHERE id=$1
    `,
    [id],
  );
};
