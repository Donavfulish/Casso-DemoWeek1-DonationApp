import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"
import { io } from "socket.io-client"

export default function QRCodeModal({ isOpen, onClose, amount, creatorName, qrData, referenceNumber }) {
  const [paymentStatus, setPaymentStatus] = useState("waiting") // 'waiting' | 'success'

  useEffect(() => {
    // Khởi tạo socket chỉ 1 lần
    const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
      transports: ["websocket"],
    })
    if (isOpen) {
      setPaymentStatus("waiting")

      // Lắng nghe sự kiện new_transaction
      socket.on("new_transaction", (tx) => {
        if (tx.ref === referenceNumber) {
          setPaymentStatus("success")
        }
      })
    }

    return () => {
      if (socket) {
        socket.off("new_transaction")
      }
    }
  }, [isOpen, referenceNumber])

  const handleClose = () => {
    setPaymentStatus("waiting")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Scan to donate {Number.parseInt(amount).toLocaleString()} VND to {creatorName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <img
            src={qrData.dynamicLink}
            alt="QR Code"
            className={`w-60 h-60 transition-opacity duration-300 `}
          />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Instructions:</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Open your banking app</li>
              <li>2. Scan this QR code</li>
              <li>3. Confirm the payment</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {paymentStatus === "waiting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Waiting for confirmation...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Thank you for your donation!</span>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
