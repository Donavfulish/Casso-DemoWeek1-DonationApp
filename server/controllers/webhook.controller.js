
import TransactionService from "../services/transaction.services.js";
import TokenService from "../services/token.services.js";
export async function handleWebhookTransaction(req, res) {
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

        // await TransactionService.createDonation({
        //     fiServiceId,
        //     accountNumber,
        //     amount,
        //     description: desc,
        //     accountName: accName,
        //     time: new Date()
        // })

        return res.json({ message: "Webhook received" });
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleWebhookRemove(req, res) {
    try {
        const payload = req.body.grantId;
        const { data } = await TokenService.removeByGrant(payload);

        if (!data) {
            console.warn(`GrantId does not exist`);
            return res.json({ message: "GrantId not found, nothing to remove" });
        }

        const io = req.app.get("io");
        io.emit("remove_account", {
            fiServiceId: data.fiserviceid,
            accountNumber: data.accountnumber
        })

        return res.json({ message: "Webhook received" });
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}