import pool from "../config/db.js";

class RoomService {
  // Tạo mới 1 row, trả về donation_code
  static async createDonationRoom(sessionId) {
    try {
      const result = await pool.query(
        `INSERT INTO donation_room (session_id) 
         VALUES ($1) 
         RETURNING donation_code`,
        [sessionId]
      );

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  // Lấy session_id từ donation_code
  static async getSessionByCode(donationCode) {
    try {
      const result = await pool.query(
        `SELECT session_id FROM donation_room WHERE donation_code = $1`,
        [donationCode]
      );

      if (result.rows.length === 0) {
        return { success: false, message: "Donation code not found" };
      }

      return {
        success: true,
        message: "Session found",
        data: result.rows[0], // { session_id }
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Failed to get session by code",
      };
    }
  }

  // Check room có tồn tại không
  static async checkCode(code) {
    try {
      const result = await pool.query('SELECT * FROM donation_room WHERE donation_code=$1', [code])
      if (result.rows.length === 0) {
        return { success: false, message: "Room not exist" };
      }
      return { success: true, message: "Join room success" };
    } catch (error) {
      throw new Error(error.message || "Failed to remove grant");
    }
  }

  // Get code room bằng session_id
  static async getCodeBySession(sessionId) {
    try {
      const result = await pool.query(`SELECT donation_code FROM donation_room WHERE session_id = $1`, [sessionId])
      if (result.rows.length === 0) {
        return { sucess: false };
      }
      return {
        success: true,
        data: result.rows[0], // { session_id }
      };
    } catch (error) {
      throw new Error(error.message || "Failed to get code by session id")
    }
  }
}

export default RoomService;
