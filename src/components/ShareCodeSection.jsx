import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function ShareCodeSection({roomCode}) {
    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        3
                    </span>
                    Your Donation Page
                </CardTitle>
                <CardDescription>Share this link with your supporters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Your donation page code:</p>
                        <code className="text-sm font-mono text-foreground bg-background px-2 py-1 rounded">
                            {roomCode}
                        </code>
                    </div>
                    <Button
                        asChild
                        variant="default"
                        className="border-border text-foreground "
                    >
                        <Link to="/linh-artist">View Sample Page</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}