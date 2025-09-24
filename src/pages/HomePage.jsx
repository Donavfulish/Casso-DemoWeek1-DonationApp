import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function HomePage() {
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
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/dashboard">Creator Dashboard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent bg-transparent"
            >
              <Link to="/linh-artist">View Sample Donation Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
