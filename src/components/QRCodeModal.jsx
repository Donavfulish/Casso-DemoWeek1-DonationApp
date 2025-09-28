import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"
import QRCodeGenerator from "./QRCodeGenerator"

export default function QRCodeModal({ isOpen, onClose, amount, creatorName }) {
  const [paymentStatus, setPaymentStatus] = useState("waiting") // 'waiting' | 'success'

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("waiting")
      // Simulate payment confirmation after 5 seconds
      const timer = setTimeout(() => {
        setPaymentStatus("success")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

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
          <QRCodeGenerator amount={amount} creatorName={creatorName} />

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
