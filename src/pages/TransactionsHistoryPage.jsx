import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"

export default function TransactionsHistoryPage() {
  const [transactions] = useState([
    {
      id: 1,
      amount: 50000,
      from: "A Generous Fan",
      time: "2024-01-15 14:30:25",
      status: "completed",
    },
    {
      id: 2,
      amount: 100000,
      from: "Anonymous Supporter",
      time: "2024-01-15 12:15:10",
      status: "completed",
    },
    {
      id: 3,
      amount: 25000,
      from: "Art Lover",
      time: "2024-01-14 18:45:33",
      status: "completed",
    },
    {
      id: 4,
      amount: 75000,
      from: "Creative Supporter",
      time: "2024-01-14 16:20:15",
      status: "completed",
    },
    {
      id: 5,
      amount: 200000,
      from: "Big Fan",
      time: "2024-01-13 20:10:45",
      status: "completed",
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Transactions History</h1>
          <p className="text-muted-foreground">View all your past donations and transactions</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Transactions</CardTitle>
            <CardDescription>Complete history of all donations received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {Number.parseInt(transaction.amount).toLocaleString()} VND
                      </span>
                      <span className="text-sm text-muted-foreground">{transaction.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">From: {transaction.from}</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
