import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

export default function LinkedBankItem({ bank, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition">
      {/* Left: Logo + Bank Info */}
      <div className="flex items-center gap-3">
        {bank.logo && (
          <img
            src={bank.logo}
            alt={bank.fiFullName}
            className="w-10 h-10 rounded-full object-cover border"
          />
        )}
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold">{bank.fiFullName}</span>
          <span className="text-gray-500 text-sm">STK: {bank.accountNumber}</span>
        </div>
      </div>

      {/* Right: Delete Button */}
      <Button
        size="icon"
        variant="destructive"
        className="ml-6 rounded-lg" // thêm khoảng cách rõ ràng
        onClick={() => onDelete(bank)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
