// services/session.services.js
import pool from "../config/db.js"; // kết nối pg
import { encrypt, decrypt } from "../utils/crypto.js";

class SessionService {
  static async createOrUpdateSession(sessionId, data) {
    const { accessToken, grantId, requestId, bankLinked } = data;
    const encryptedToken = accessToken ? encrypt(accessToken) : null;

    await pool.query(
      `INSERT INTO sessions(session_id, access_token, grant_id, request_id, bank_linked, created_at, updated_at)
       VALUES($1,$2,$3,$4,$5,NOW(),NOW())
       ON CONFLICT(session_id)
       DO UPDATE SET access_token=$2, grant_id=$3, request_id=$4, bank_linked=$5, updated_at=NOW()`,
      [sessionId, encryptedToken, grantId, requestId, bankLinked]
    );
  }

  static async getSession(sessionId) {
    const res = await pool.query(`SELECT * FROM sessions WHERE session_id=$1`, [sessionId]);
    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      sessionId: row.session_id,
      accessToken: row.access_token ? decrypt(row.access_token) : null,
      grantId: row.grant_id,
      requestId: row.request_id,
      bankLinked: row.bank_linked
    };
  }
}

export default SessionService;
