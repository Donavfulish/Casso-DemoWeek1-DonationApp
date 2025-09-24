import ChannelServices from "../services/channel.services.js";

export const getListServices = async (req, res, next) => {
    try {
        const result = await ChannelServices.getListServices();
        res.json({fiServices: result.fiServices});
    } catch (err) {
        next(err);
    }
}