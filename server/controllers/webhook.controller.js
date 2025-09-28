
import TransactionService from "../services/transaction.services.js";

export async function handleWebhook(req, res) {
    try {
        const payload = req.body.transaction;
        const {
            fiId: fiServiceId,
            accountNumber,
            amount,
            counterAccountName
        } = payload;

        // Gán default nếu thiếu
        const desc = "Donate cho thằng em có động lực";
        const accName = counterAccountName || "Kẻ bí ấn";

        const io = req.app.get("io");
        io.emit("new_transaction", {
            amount,
            description: desc,
            accountName: accName
        });

        await TransactionService.createDonation({
            fiServiceId,
            accountNumber,
            amount,
            description: desc,
            accountName: accName,
            time: new Date()
        })

        return res.json({ message: "Webhook received" });
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}