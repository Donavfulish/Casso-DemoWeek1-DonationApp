import pool from "../config/db.js";

class TransactionService {
    static async getByIdAndAcount(fiServiceId, accountNumber) {
        const result = await pool.query(
            " SELECT * FROM DONATION_HISTORY  WHERE fiserviceid = $1 AND accountnumber = $2"
            , [fiServiceId, accountNumber]);

        return result.rows;
    }

    static async createDonation({ fiServiceId, accountNumber, amount, time, description, accountName }) {
        const query = `
      INSERT INTO DONATION_HISTORY (fiserviceid, accountNumber, amount, time, description, accountname)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const values = [fiServiceId, accountNumber, amount, time, description || "Goodluck", accountName || "Ai đó"];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

export default TransactionService