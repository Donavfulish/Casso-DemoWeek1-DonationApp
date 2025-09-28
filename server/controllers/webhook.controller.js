export async function handleWebhook(req, res) {
    try {
        const transaction = req.body.transaction || {
            counterAccountName: "Unknown",
            amount: 0,
            description: "No data (test mode)",
        };

        const io = req.app.get("io");
        io.emit("new_transaction", {
            donor: transaction.counterAccountName,
            amount: transaction.amount,
            description: transaction.description,
        });

        return res.json({ message: "Webhook received" });
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}