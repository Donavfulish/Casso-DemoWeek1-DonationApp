import RoomService from "../services/room.services.js";

export const createDonationRoom = async (req, res) => {
  try {
    const sessionId = req.sessionID;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const result = await RoomService.createDonationRoom(sessionId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getSessionByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "donationCode is required",
      });
    }

    const result = await RoomService.getSessionByCode(code);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const checkCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "donationCode is required",
      });
    }
    const result = await RoomService.checkCode(code);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
}
