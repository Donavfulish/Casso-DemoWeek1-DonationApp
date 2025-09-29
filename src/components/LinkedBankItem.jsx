import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export default function LinkedBankItem({ bank, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = () => {
    onDelete(bank)
    setIsModalOpen(false) // đóng modal sau khi xóa
  }

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
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-destructive"/>
              <h3 className="text-lg font-semibold text-destructive">
                Xác nhận xóa
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa phân quyền cho tài khoản "{bank.accountNumber}" của "{bank.fiFullName}" không?
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
