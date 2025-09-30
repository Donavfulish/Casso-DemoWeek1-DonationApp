import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import QRCodeModal from "../components/QRCodeModal"
import { toast } from "react-toastify"
import { handleApi } from "../api/handleApi"
import { getQRCodeForUser } from "../api/qr.api"
import { checkCode } from "../api/room.api"


export default function DonationPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [amount, setAmount] = useState("")
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [valid, setValid] = useState(false)
  const checkedRef = useRef(false)
  const presetAmounts = ["10000", "20000", "50000", "100000", "200000", "500000"]

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    const verifyCode = async () => {
      try {
        const res = await handleApi(checkCode(code)) // gọi API backend check code
        if (res.success) {
          setValid(true)
        } else {
          navigate("/") // redirect về home
        }
      } catch {
        navigate("/")
      }
    }
    if (!location.state) {
      verifyCode()
    } else if (location.state.Direct) {
      setValid(true)
    } else if (location.state.DirectFromDB) {
      setValid(true)
      toast.success("Join room success")
    }
  }, [code, navigate])

  const handlePresetAmount = (presetAmount) => {
    setAmount(presetAmount)
  }

  const handleGenerateQR = async () => {
    if (!amount.trim()) {
      toast.error("Please enter a valid amount!")
      return
    }
    const payload = {
      code,
      amount: Number(amount),
      description: "Test QR",
      referenceNumber: "11",
    }
    try {
      const data = await handleApi(getQRCodeForUser(payload))
      setQrData(data)
      setShowQRModal(true)
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong while generating QR")
    }
  }

  if (!valid) return <div>Loading....</div>
  // Mock creator data
  const creatorData = {
    name: code === "linh-artist" ? "Linh Artist" : code,
    bio: "Digital artist creating beautiful illustrations and designs. Support my creative journey!",
    avatar: "/creator-avatar.png",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-border bg-card shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={creatorData.avatar || "/placeholder.svg"} alt={creatorData.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {creatorData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">{creatorData.name}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed px-2">{creatorData.bio}</p>
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

        {showQRModal && qrData && (
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            amount={amount}
            creatorName={creatorData.name}
            qrData={qrData}
            referenceNumber={"11"}
          />
        )}
      </div>
    </div>
  )
}
