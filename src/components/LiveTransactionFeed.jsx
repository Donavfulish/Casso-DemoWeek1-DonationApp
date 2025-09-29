import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { io } from "socket.io-client";
import { getTransactionList } from "../api/transaction.api";
import { handleApi } from "../api/handleApi"
import api from "../api";

export default function LiveTransactionFeed({ linkedBanks = [] }) {
  const [transactions, setTransactions] = useState([])
  const [latestAlert, setLatestAlert] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  // ------------------ Socket.IO ------------------
  useEffect(() => {
    const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
      transports: ["websocket"],
    })

    socket.on("new_transaction", (data) => {
      const newTransaction = {
        amount: data.amount,
        from: data.accountName,
        description: data.description,
        time: new Date()
      }

      // Cập nhật danh sách
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])

      // Hiển thị alert trong 10s
      setLatestAlert(newTransaction)
      setIsVisible(true)

      setTimeout(() => setIsVisible(false), 5000)
      // Sau 10s thì gỡ khỏi DOM
      setTimeout(() => setLatestAlert(null), 5000)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
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
          🎉 <span className="font-semibold">{latestAlert.from}</span> vừa donate{" "}
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
      <h3 className="text-lg font-semibold text-foreground">Recent Donations (Live)</h3>
      {/* Danh sách donate */}
      <div className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No donations yet</p>
        ) : (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 transition-all duration-500 ${index === 0 ? "animate-in fade-in-0 slide-in-from-top-2" : ""
                }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-card-foreground">
                  {Number.parseInt(transaction.amount).toLocaleString()} VND
                </span>
                <span className="text-sm text-muted-foreground">from {transaction.from}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.time), { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
