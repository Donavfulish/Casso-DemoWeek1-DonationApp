import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"

export default function TransactionsHistoryPage() {
  const [transactions] = useState([
    {
      id: 1,
      amount: -2052000,
      from: "maketing thue server 3 thang",
      time: "2025-09-25",
      status: "completed",
    },
    {
      id: 2,
      amount: -12614000,
      from: "tran factory boc chuyen xuong 7 tan hang ngay 18",
      time: "2025-09-24",
      status: "completed",
    },
    {
      id: 3,
      amount: 48429030.3,
      from: "CONG TY TNHH ARC WORLDWIDE VN CTY TNHH ARC WORLDWIDE HOAN LAI TIE N CHUYEN NHAM",
      time: "2025-09-23",
      status: "completed",
    },
    {
      id: 4,
      amount: 8450000,
      from: "CTY TNHH NONG NGHIEP GAGACO TC.DNTD 087728.ck mua dat tu Gagaco",
      time: "2025-09-21",
      status: "completed",
    },
    {
      id: 5,
      amount: -29450000,
      from: "salary factory luong NV2 9 nam 2019",
      time: "2025-09-22",
      status: "completed",
    },
    {
      id: 6,
      amount: -5814000,
      from: "factory tron trong xuong 3 lan",
      time: "2025-09-22",
      status: "completed",
    },
    {
      id: 7,
      amount: -840000,
      from: "maketing lam poster bang hieu tai vuon dau",
      time: "2025-09-22",
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
                      {transaction.amount > 0 ? (
                        <span className="font-medium text-green-400">
                          {transaction.amount.toLocaleString()} VND
                        </span>
                      ) : (
                        <span className="font-medium text-destructive">
                          {transaction.amount.toLocaleString()} VND
                        </span>
                      )}
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
