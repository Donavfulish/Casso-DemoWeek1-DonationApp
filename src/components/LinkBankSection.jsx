import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import LinkedBankItem from "../components/LinkedBankItem"

export default function LinkBankSection({ bankLinked, linkedBanks, onDeleteBank, onLinkBank }) {
    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <span className="bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        1
                    </span>
                    Link Your Bank Account
                    {bankLinked ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                </CardTitle>
                <CardDescription>Connect your bank account to receive donations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm">
                    {linkedBanks.length > 0 ? (
                        <div className="space-y-2">
                            {linkedBanks.map((bank, idx) => (
                                <LinkedBankItem key={idx} bank={bank} onDelete={onDeleteBank} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-yellow-400">Not linked yet</div>
                    )}
                </div>
                <Button onClick={onLinkBank} className="w-full">
                    {bankLinked ? "Link Another Account" : "Link Bank Account"}
                </Button>
            </CardContent>
        </Card>
    )
}
