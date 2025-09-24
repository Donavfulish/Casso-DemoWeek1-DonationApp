"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import QRCodeModal from "../components/QRCodeModal"

export default function DonationPage() {
  const { username } = useParams()
  const [amount, setAmount] = useState("")
  const [showQRModal, setShowQRModal] = useState(false)

  const presetAmounts = ["20000", "50000", "100000"]

  const handlePresetAmount = (presetAmount) => {
    setAmount(presetAmount)
  }

  const handleGenerateQR = () => {
    if (amount) {
      setShowQRModal(true)
    }
  }

  // Mock creator data
  const creatorData = {
    name: username === "linh-artist" ? "Linh Artist" : username,
    bio: "Digital artist creating beautiful illustrations and designs. Support my creative journey!",
    avatar: "/creator-avatar.png",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-border bg-card">
          <CardHeader className="text-center space-y-4">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={creatorData.avatar || "/placeholder.svg"} alt={creatorData.name} />
              <AvatarFallback className="text-lg">
                {creatorData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-card-foreground text-2xl">{creatorData.name}</CardTitle>
              <CardDescription className="mt-2 text-center">{creatorData.bio}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Donation Amount</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    VND
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetAmount(presetAmount)}
                    className="text-xs"
                  >
                    {Number.parseInt(presetAmount).toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateQR}
              disabled={!amount}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Generate Donation QR
            </Button>
          </CardContent>
        </Card>

        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          amount={amount}
          creatorName={creatorData.name}
        />
      </div>
    </div>
  )
}
