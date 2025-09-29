import TransactionService from "../services/transaction.services.js";

export const TransactionController = {
  async createDonation(req, res) {
    try {
      const { fiServiceId, accountNumber, amount, description, accountName } = req.body;
      const donation = await TransactionService.createDonation({
        fiServiceId,
        accountNumber,
        amount,
        description,
        accountName
      });

      res.json({
        success: true,
        message: "Donation saved successfully",
        data: donation
      });
    } catch (error) {
      console.error("[createDonation] error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getDonations(req, res) {
    try {
      const donations = await TransactionService.getList();

      res.json({
        donate: donations.map(d => ({
          amount: d.amount,
          accountName: d.accountName,
          description: d.description,
          time: d.time,
          fiServiceId: d.fiserviceid,
          accountNumber: d.accountnumber
        }))
      });
    } catch (error) {
      console.error("[getDonations] error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
