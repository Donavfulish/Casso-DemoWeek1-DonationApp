import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { handleApi } from "../api/handleApi"
import { getQRCode } from "../api/qr.api"
import { toast } from "react-toastify"

export default function TestPaymentQRCard({ linkedBanks }) {
    const [testAmount, setTestAmount] = useState("")
    const [showTestQR, setShowTestQR] = useState(false)
    const [qrData, setQrData] = useState(null)

    const bankLinked = linkedBanks && linkedBanks.length > 0


    useEffect(() => {
        if (!bankLinked) {
            setQrData(null)
            setShowTestQR(false)
            setTestAmount("") // nếu muốn clear luôn input
        }
    }, [bankLinked])

    const handleCreateTestQR = async () => {
        if (!testAmount || !bankLinked) return

        const bank = linkedBanks[0]
        const payload = {
            fiServiceId: bank.fiServiceId,
            accountNumber: bank.accountNumber,
            amount: Number(testAmount),
            description: "Test QR",
            referenceNumber: "11"
        }

        try {
            const data = await handleApi(getQRCode(payload)) // 👈 tự xử lý toast theo message backend
            setQrData(data)
            setShowTestQR(true)
        } catch (err) {
            console.error("Failed to create QR:", err)
        }
    }

    return (
        <Card
            className={`border-border bg-card transition relative ${!bankLinked ? "opacity-50 cursor-not-allowed" : ""
                }`}
            onClick={() => {
                if (!bankLinked) {
                    toast.error("Please link a bank account first!") // 👈 toastify
                }
            }}
        >
            <CardHeader>
                <CardTitle className="text-card-foreground">
                    Step 2 & 3: Test Payment QR
                </CardTitle>
                <CardDescription>
                    Create a test QR code to verify the payment flow
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Test Amount
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="Enter test amount"
                            value={testAmount}
                            onChange={(e) => setTestAmount(e.target.value)}
                            className="pr-12"
                            disabled={!bankLinked}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                            VND
                        </span>
                    </div>
                </div>
                <Button
                    onClick={handleCreateTestQR}
                    disabled={!testAmount || !bankLinked}
                    className="w-full"
                >
                    Create Test QR Code
                </Button>

                {showTestQR && qrData?.link && (
                    <div className="mt-4 py-2 px-3 border border-border rounded-lg bg-muted/20 flex justify-center">
                        <img src={qrData.dynamicLink} alt="QR Code" className="w-60 h-60" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
