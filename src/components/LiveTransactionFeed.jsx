"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

export default function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: "50000",
      from: "A Generous Fan",
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: 2,
      amount: "100000",
      from: "Anonymous Supporter",
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: 3,
      amount: "20000",
      from: "Art Lover",
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
  ])

  useEffect(() => {
    // Simulate new donations every 10-20 seconds
    const interval = setInterval(
      () => {
        const randomAmount = ["20000", "50000", "100000", "75000"][Math.floor(Math.random() * 4)]
        const randomNames = [
          "A Generous Fan",
          "Anonymous Supporter",
          "Art Lover",
          "Kind Stranger",
          "Creative Supporter",
        ]
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]

        const newTransaction = {
          id: Date.now(),
          amount: randomAmount,
          from: randomName,
          time: new Date(),
        }

        setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]) // Keep only 10 most recent
      },
      Math.random() * 10000 + 10000,
    ) // Random interval between 10-20 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Recent Donations (Live)</h3>

      <div className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No donations yet</p>
        ) : (
          transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 transition-all duration-500 ${
                index === 0 ? "animate-in fade-in-0 slide-in-from-top-2" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-card-foreground">
                  {Number.parseInt(transaction.amount).toLocaleString()} VND
                </span>
                <span className="text-sm text-muted-foreground">from {transaction.from}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(transaction.time, { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
