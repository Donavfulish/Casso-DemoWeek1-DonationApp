import pool from "../config/db.js";
import { encrypt, decrypt } from "../utils/crypto.js";

class SessionService {
  static async createOrUpdateSession(sessionId, data) {
    const { accessToken, grantId, requestId, bankLinked, fiFullName, logo, fiServiceId, accountNumber } = data;
    const encryptedToken = accessToken ? encrypt(accessToken) : null;

    await pool.query(
      `INSERT INTO sessions(session_id, access_token, grant_id, request_id, bank_linked, fiFullName, logo, created_at, updated_at, fiServiceId, accountNumber)
       VALUES($1,$2,$3,$4,$5,$6,$7,NOW(),NOW(),$8,$9)
       ON CONFLICT(session_id, fiServiceId, accountNumber)
       DO UPDATE SET access_token=$2, grant_id=$3, request_id=$4, bank_linked=$5, fiFullName=$6, logo=$7, updated_at=NOW()`,
      [sessionId, encryptedToken, grantId, requestId, bankLinked, fiFullName, logo, fiServiceId, accountNumber]
    );
  }

  static async getSessions(sessionId) {
    const res = await pool.query(`SELECT * FROM sessions WHERE session_id=$1`, [sessionId]);
    return res.rows.map(row => ({
      sessionId: row.session_id,
      accessToken: row.access_token ? decrypt(row.access_token) : null,
      grantId: row.grant_id,
      requestId: row.request_id,
      bankLinked: row.bank_linked,
      fiFullName: row.fifullname,
      logo: row.logo,
      fiServiceId: row.fiserviceid,
      accountNumber: row.accountnumber
    }));
  }

  // Tìm theo fiServiceId + accountNumber
  static async findByFiServiceAndAccount(fiServiceId, accountNumber) {
    const result = await pool.query(
      `SELECT * FROM sessions WHERE fiserviceid = $1 AND accountnumber = $2`,
      [fiServiceId, accountNumber]
    );
    if (result.rowCount === 0) return null;

    const row = result.rows[0];
    return {
      sessionId: row.session_id,
      accessToken: row.access_token ? decrypt(row.access_token) : null,
      grantId: row.grant_id,
      requestId: row.request_id,
      bankLinked: row.bank_linked,
      fiFullName: row.fifullname,
      logo: row.logo,
      fiServiceId: row.fiserviceid,
      accountNumber: row.accountnumber
    };
  }

  // Xóa theo fiServiceId + accountNumber
  static async deleteByFiServiceAndAccount(fiServiceId, accountNumber) {
    await pool.query(
      `DELETE FROM sessions WHERE fiserviceid = $1 AND accountnumber = $2`,
      [fiServiceId, accountNumber]
    );
  }

}

export default SessionService;
