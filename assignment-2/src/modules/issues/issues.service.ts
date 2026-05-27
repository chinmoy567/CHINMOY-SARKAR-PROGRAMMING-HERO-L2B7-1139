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
