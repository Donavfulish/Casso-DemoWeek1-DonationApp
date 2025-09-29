import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { toast } from "react-toastify"
import { handleApi } from "../api/handleApi"
import { checkCode } from "../api/room.api"

export default function HomePage() {
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const [code, setCode] = useState("")

  const handleJoinRoom = async () => {
    if (!code.trim()) {
      toast.error("Please enter a code!")
      return
    }

    try {
      const res = await handleApi(checkCode(code.trim()))
      if (res.success) {
        setModalOpen(false)
        navigate(`/${code.trim()}`)
      } else {
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">QR-Donate</h1>
          <p className="text-muted-foreground text-lg">Simple QR Code Donations</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-card-foreground">Get Started</CardTitle>
            <CardDescription>Choose your path to start using QR-Donate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="default" className="w-full" onClick={() => navigate("/dashboard")}>
              <Link to="/dashboard">Creator Dashboard</Link>
            </Button>

            <Button  variant="outline" className="w-full" onClick={() => setModalOpen(true)}>
              Donation Room
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Modal nhập code */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Donation Code</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinRoom}>Join</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
