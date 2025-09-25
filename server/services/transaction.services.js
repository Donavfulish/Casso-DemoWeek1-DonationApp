import pool from "../config/db.js"

class TransactionServices {
    static async getTransaction() {
        const query =
            "SELECT * FROM transactions ORDER BY transaction_datetime DESC;";
        const result = await pool.query(query);
        return result.rows;
    }
}
export default TransactionServices