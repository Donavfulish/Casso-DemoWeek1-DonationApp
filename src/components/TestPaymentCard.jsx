import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { toast } from "react-toastify"   // 👈 đổi import
import { getQRCode } from "../api/sharedApi"

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
        if (!testAmount) return
        if (!bankLinked) {
            toast.error("Please link a bank account first!") // 👈 toastify
            return
        }

        const bank = linkedBanks[0]
        try {
            const payload = {
                fiServiceId: bank.fiServiceId,
                accountNumber: bank.accountNumber,
                amount: Number(testAmount),
                description: "Test QR",
                referenceNumber: "11"
            }
            const res = await getQRCode(payload)
            setQrData(res.data)
            setShowTestQR(true)
            toast.success("Test QR created successfully!") // 👈 toastify
        } catch (err) {
            console.error("Failed to create QR:", err)
            toast.error("Failed to create QR. Check console for details.") // 👈 toastify
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
                        <img src={qrData.link} alt="QR Code" className="w-60 h-60" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
