import { pool } from "../../db";
import type { TIssue } from "./issues.interface";

// create issue
export const createIssueIntoDB = async (
  payload: TIssue,
  reporter_id: number,
) => {
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
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

// get issues
export const getIssuesFromDB = async (query: any) => {
  const { type, status, sort } = query;

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

  // add WHERE
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  if (sort === "newest") {
    sql += ` ORDER BY created_at DESC`;
  }
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  }
  const result = await pool.query(sql);
  return result.rows;
};

// get single issue
export const getSingleIssueFromDB = async (id: number) => {
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
  //find a sepcific issue
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
  // contributor permission check
  if (user.role === "contributor") {
    // own issue check
    if (issue.reporter_id !== user.id) {
      const error: any = new Error("You can update only your own issue");
      error.statusCode = 403;
      throw error;
    }
    // status check
    if (issue.status !== "open") {
      const error: any = new Error("Only open issues can be updated");
      error.statusCode = 409;
      throw error;
    }
  }
  // maintainers can update any issue without any restriction
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
    [title, description, type, id],
  );

  return result.rows[0];
};
