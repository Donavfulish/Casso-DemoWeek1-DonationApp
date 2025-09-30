import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { io } from "socket.io-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { getTransactionList } from "../api/transaction.api"

export default function LiveTransactionFeed({ linkedBanks = [], bankLinked }) {
  const [transactions, setTransactions] = useState([])
  const [latestAlert, setLatestAlert] = useState(null)
  // ------------------ Fetch ban đầu ------------------
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactionList()
        setTransactions(res.data?.donate || [])
      } catch (err) {
        console.error("Failed to fetch transactions", err)
      }
    }
    if (bankLinked) {
      fetchTransactions()
    }
  }, [bankLinked]) 

  // ------------------ Socket.IO ------------------
  useEffect(() => {
    const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
      transports: ["websocket"],
    })

    socket.on("new_transaction", (data) => {
      const newTransaction = {
        amount: data.amount,
        accountName: data.accountName,
        description: data.description,
        time: new Date()
      }
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])
      setLatestAlert(newTransaction)
      setTimeout(() => setLatestAlert(null), 5000)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <span className="bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            4
          </span> Recent Donations (Live)
        </CardTitle>
        <CardDescription>Real-time donation feed</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          {latestAlert && (
            <div
              key={latestAlert.id}
              className="absolute right-0 left-0 mx-auto w-fit max-w-md
                     bg-green-400 text-white px-6 py-4 rounded-xl shadow-lg text-center z-50
                     animate-in fade-in-0 slide-in-from-bottom-4
                     animate-out fade-out-0 slide-out-to-top-4
                     duration-1000"
            >
              🎉 <span className="font-semibold">{latestAlert.accountName}</span> vừa donate{" "}
              <span className="font-bold">
                {Number.parseInt(latestAlert.amount).toLocaleString()} VND
              </span>
              {latestAlert.description && (
                <p className="mt-2 italic text-sm text-white/90">
                  “{latestAlert.description}”
                </p>
              )}
            </div>
          )}
          {/* Danh sách donate */}
          <div className="space-y-2"> {bankLinked ? (
            transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No donations yet. Share your donation page to start receiving support!</p>
            ) : (
              transactions.map((transaction, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-1000 ${index === 0 ? "bg-primary/10 border-primary/30 animate-pulse" : "bg-muted/50 border-border"
                    }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{transaction.accountName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(transaction.time), { addSuffix: true })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{Number.parseInt(transaction.amount).toLocaleString()} VND</p>
                  </div>
                </div>
              ))
            )) : (
            <p className="text-muted-foreground text-center py-8">Please linked bank first!</p>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
