import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { CheckCircle, AlertCircle } from "lucide-react"
import QRCodeGenerator from "../components/QRCodeGenerator"
import LiveTransactionFeed from "../components/LiveTransactionFeed"
import { getGrantToken, getListServices, exchangeToken, checkSession, getQRCode } from "../api/sharedApi"
import BankSelectModal from "../components/BankSelectModal"

export default function DashboardPage() {
  const [bankLinked, setBankLinked] = useState(false)
  const [testAmount, setTestAmount] = useState("")
  const [showTestQR, setShowTestQR] = useState(false)
  const [accessToken, setAccessToken] = useState(null);
  const [grantToken, setGrantToken] = useState(null)
  const [isOpenBankSelect, setOpenBankSelect] = useState(false)
  const [serviceList, setServiceList] = useState([])
  const [nameBank, setNameBank] = useState(null)
  const [qrData, setQrData] = useState(null);

  // Lấy danh sách service 
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getListServices();
        setServiceList(res.data || [])
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [])

  useEffect(() => {
    checkSession()
      .then(res => {
        console.log(res)
        // Backend trả về thông tin session hợp lệ
        // Ví dụ res.data = { accessToken, grantId, requestId }
        setBankLinked(res.data.bankLinked)
      })
      .catch(err => console.error("Check session failed:", err));
  }, []);

  // Mở CasLink
  const openCasLink = (token) => {
    if (!token) {
      alert("Chưa có grantToken, vui lòng thử lại!");
      return;
    }

    const CasLinkConfigs = {
      redirectUri: "http://localhost:5173/dashboard",
      iframe: true,
      grantToken: token,
      feature: "qrpay",
      fiServiceType: "ALL",
      onSuccess: (publicToken) => {
        exchangeToken(publicToken)
          .then(res => {
            if (res.data.success) {
              console.log(res.data.message);
              setBankLinked(true);
            }
          }).catch(console.error)
      },
      onExit: () => console.log("CasLink exit"),
    };

    // Gọi hook **ngay lúc có token**
    const { open } = BankHub.useBankHubLink(CasLinkConfigs);
    open();
  };

  const handleLinkBank = async () => {
    setOpenBankSelect(true);
  }

  const handleCreateTestQR = async () => {
    if (!testAmount) return;
    if (!bankLinked) {
      alert("Please link a bank account first!");
      return;
    }
    try {
      // Gọi backend tạo QR
      const payload = { amount: 2000, description: "Test QR", referenceNumber: "11" };
      const res = await getQRCode(payload);
      console.log(res)
      // res.data chứa QR info từ backend
      setQrData(res.data);
      setShowTestQR(true);

    } catch (err) {
      console.error("Failed to create QR:", err);
      alert("Failed to create QR. Check console for details.");
    }

  }

  const handleSelectServices = async (services) => {
    try {
      const res = await getGrantToken(services.id);
      const token = res.data.grantToken;
      setNameBank(services.fiName)
      setGrantToken(token);
      setOpenBankSelect(false);
      openCasLink(token);

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your QR-Donate account</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Step 1: Link Bank Account */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                Step 1: Link Your Bank Account
                {bankLinked ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>Connect your bank account to receive donations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Status:{" "}
                  {bankLinked ? (
                    <span className="text-green-500 font-medium">Linked to {nameBank}</span>
                  ) : (
                    <span className="text-yellow-500 font-medium">Not Linked</span>
                  )}
                </span>
              </div>
              <Button onClick={handleLinkBank} className="w-full">
                {bankLinked ? "Link Another Account" : "Link Bank Account"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 & 3: Test Payment QR */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Step 2 & 3: Test Payment QR</CardTitle>
              <CardDescription>Create a test QR code to verify the payment flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Test Amount</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter test amount"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    VND
                  </span>
                </div>
              </div>
              <Button onClick={handleCreateTestQR} disabled={!testAmount} className="w-full">
                Create Test QR Code
              </Button>

              {showTestQR && qrData?.link && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20 flex justify-center">
                  <img
                    src={qrData.link}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 4: Live Transaction Feed */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Step 4: Live Transaction Feed</CardTitle>
            <CardDescription>Monitor incoming donations in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <LiveTransactionFeed />
          </CardContent>
        </Card>
      </div>
      <BankSelectModal
        isOpen={isOpenBankSelect}
        onClose={() => setOpenBankSelect(false)}
        services={serviceList}
        onSelectService={handleSelectServices}
      />
    </div>
  )
}
