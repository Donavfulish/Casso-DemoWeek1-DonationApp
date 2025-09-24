export default function QRCodeGenerator({ amount, creatorName }) {
  // Generate a simple QR code placeholder
  // In a real app, you'd use a QR code library like qrcode.js
  const qrData = `DONATION:${creatorName}:${amount}VND`

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
        <div
          className="w-40 h-40 bg-black"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Cg fill='black'%3E%3Crect x='0' y='0' width='10' height='10'/%3E%3Crect x='20' y='0' width='10' height='10'/%3E%3Crect x='40' y='0' width='10' height='10'/%3E%3Crect x='60' y='0' width='10' height='10'/%3E%3Crect x='80' y='0' width='10' height='10'/%3E%3Crect x='0' y='20' width='10' height='10'/%3E%3Crect x='40' y='20' width='10' height='10'/%3E%3Crect x='80' y='20' width='10' height='10'/%3E%3Crect x='0' y='40' width='10' height='10'/%3E%3Crect x='20' y='40' width='10' height='10'/%3E%3Crect x='60' y='40' width='10' height='10'/%3E%3Crect x='80' y='40' width='10' height='10'/%3E%3Crect x='20' y='60' width='10' height='10'/%3E%3Crect x='40' y='60' width='10' height='10'/%3E%3Crect x='60' y='60' width='10' height='10'/%3E%3Crect x='0' y='80' width='10' height='10'/%3E%3Crect x='20' y='80' width='10' height='10'/%3E%3Crect x='40' y='80' width='10' height='10'/%3E%3Crect x='60' y='80' width='10' height='10'/%3E%3Crect x='80' y='80' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        QR Code for {Number.parseInt(amount).toLocaleString()} VND
      </p>
    </div>
  )
}
