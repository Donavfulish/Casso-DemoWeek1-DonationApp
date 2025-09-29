import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { handleApi } from "../api/handleApi"
import { getQRCode } from "../api/qr.api"
import { toast } from "react-toastify"
import { io } from "socket.io-client"

export default function TestPaymentQRCard({ linkedBanks }) {
    const [testAmount, setTestAmount] = useState("")
    const [selectedBank, setSelectedBank] = useState(null)
    const [showTestQR, setShowTestQR] = useState(false)
    const [qrData, setQrData] = useState(null)
    const [isUsed, setIsUsed] = useState(false) // ⚡ QR used flag

    const bankLinked = linkedBanks && linkedBanks.length > 0


    useEffect(() => {
        if (bankLinked && !selectedBank) {
            setSelectedBank(linkedBanks[0])
        }
        if (!bankLinked) {
            setSelectedBank(null)
            setQrData(null)
            setShowTestQR(false)
            setTestAmount("")
        }
    }, [bankLinked, linkedBanks, selectedBank])

    // ------------------ Socket: Listen for new_transaction ------------------
    useEffect(() => {
        const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
            transports: ["websocket"]
        })

        socket.on("new_transaction", (data) => {
            if (showTestQR) {
                setIsUsed(true)
                toast.info("QR code is already used. Please re-create to have a new QR!")
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [showTestQR])

    const handleCreateTestQR = async () => {
        if (!testAmount || !selectedBank) {
            toast.error("Please select a bank and enter amount")
            return
        }

        const payload = {
            fiServiceId: selectedBank.fiServiceId,
            accountNumber: selectedBank.accountNumber,
            amount: Number(testAmount),
            description: "Test QR",
            referenceNumber: "11"
        }

        try {
            const data = await handleApi(getQRCode(payload)) // 👈 tự xử lý toast theo message backend
            setQrData(data)
            setShowTestQR(true)
            setIsUsed(false)
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
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <span className="bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        2
                    </span>
                    Test Payment QR
                </CardTitle>
                <CardDescription>
                    Create a test QR code to verify the payment flow
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Select Bank
                    </label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedBank?.accountNumber || ""}
                        onChange={(e) => {
                            const bank = linkedBanks.find(b => b.accountNumber === e.target.value)
                            setSelectedBank(bank)
                        }}
                        disabled={!bankLinked}
                    >
                        <option value="" disabled>-- Select a bank --</option>
                        {linkedBanks?.map((bank) => (
                            <option key={bank.accountNumber} value={bank.accountNumber}>
                                {bank.fiFullName} - {bank.accountNumber}
                            </option>
                        ))}
                    </select>
                </div>
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
                    <div className="relative mt-4 py-2 px-3 border border-border rounded-lg bg-muted/20 flex justify-center">
                        <img
                            src={qrData.dynamicLink}
                            alt="QR Code"
                            className={`w-60 h-60 transition-opacity duration-300 ${isUsed ? "opacity-30" : "opacity-100"}`}
                        />
                        {isUsed && (
                            <div className="absolute inset-0 flex items-center justify-center text-center px-2">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                    ⚠️ Already used. Re-create to have new QR
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
