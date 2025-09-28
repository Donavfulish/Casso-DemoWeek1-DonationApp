import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { checkSession } from "../api/session.api"
import { handleApi } from "../api/handleApi"
import Header from "@/components/Header"

export default function AccountBalancePage() {
  const [balance, setBalance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadBalance()
  }, [])

  const loadBalance = async () => {
    const data = await handleApi(checkSession())
    setBalance(sessionData.balance || 65798005)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(async () => {
      await loadBalance()
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Account Balance</h1>
          <p className="text-muted-foreground">View your current account balance and earnings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Current Balance</CardTitle>
              <CardDescription>Your available funds from donations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Number.parseInt(balance).toLocaleString()} VND
                </div>
                <p className="text-muted-foreground text-sm">Available for withdrawal</p>
              </div>
              <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Balance"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Earnings Summary</CardTitle>
              <CardDescription>Your donation statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Donations:</span>
                  <span className="font-medium text-foreground">450,000 VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month:</span>
                  <span className="font-medium text-foreground">125,000 VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supporters:</span>
                  <span className="font-medium text-foreground">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Donation:</span>
                  <span className="font-medium text-foreground">19,565 VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
