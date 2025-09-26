import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { CheckCircle, AlertCircle } from "lucide-react"
import LiveTransactionFeed from "../components/LiveTransactionFeed"
import { getGrantToken, getListServices, exchangeToken, checkSession, getQRCode, removeGrant } from "../api/sharedApi"
import BankSelectModal from "../components/BankSelectModal"
import { io } from "socket.io-client";
import Header from "../components/Header"

export default function DashboardPage() {
  const [bankLinked, setBankLinked] = useState(false)
  const [testAmount, setTestAmount] = useState("")
  const [showTestQR, setShowTestQR] = useState(false);
  const [grantToken, setGrantToken] = useState(null)
  const [isOpenBankSelect, setOpenBankSelect] = useState(false)
  const [serviceList, setServiceList] = useState([])
  const [nameBank, setNameBank] = useState(null)
  const [qrData, setQrData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [linkedBankInfo, setLinkedBankInfo] = useState({ fiFullName: null, logo: null });


  // ------------------ Socket.IO ------------------
  useEffect(() => {
    const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
      transports: ["websocket"],
    });

    socket.on("new_transaction", (data) => {
      console.log("📥 New transaction:", data);
      setTransactions((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ------------------ Load Services ------------------
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getListServices();
        setServiceList(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  // ------------------ Check Session (Reload Safe) ------------------
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await checkSession();
        setBankLinked(res.data.bankLinked || false);
        setLinkedBankInfo({
          fiFullName: res.data.fiFullName || null,
          logo: res.data.logo || null
        });
      } catch (err) {
        console.error("Check session failed:", err);
        setBankLinked(false);
        setLinkedBankInfo({ fiFullName: null, logo: null });
      }
    };
    fetchSession();
  }, []);

  // ------------------ CasLink ------------------
  const openCasLink = (token, fiFullName, logo) => {
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
        exchangeToken({ publicToken, fiFullName, logo })
          .then(res => {
            if (res.data.success) {
              console.log(res.data.message);
              // Chỉ update state bankLinked, token vẫn server-side
              setBankLinked(true);
              console.log(bankLinked, linkedBankInfo)
            }
          })
          .catch(() => {
            setLinkedBankInfo({
              fiFullName: null,
              logo: null
            });
            console.error
          });
      },
      onExit: () => console.log("CasLink exit"),
    };

    const { open } = BankHub.useBankHubLink(CasLinkConfigs);
    open();
  };

  // ------------------ Handlers ------------------
  const handleLinkBank = async () => setOpenBankSelect(true);

  const handleDeleteBank = async () => {
    try {
      await removeGrant(); // ✅ sửa tên hàm đúng
      // reset state UI
      setBankLinked(false);
      setLinkedBankInfo({ fiFullName: null, logo: null });
      setGrantToken(null);
      alert("Bank account unlinked successfully!");
    } catch (err) {
      console.error("Failed to remove bank:", err);
      alert("Failed to remove bank. Check console for details.");
    }
  };

  const handleCreateTestQR = async () => {
    if (!testAmount) return;
    if (!bankLinked) {
      alert("Please link a bank account first!");
      return;
    }
    try {
      const payload = { amount: Number(testAmount), description: "Test QR", referenceNumber: "11" };
      const res = await getQRCode(payload);
      setQrData(res.data);
      setShowTestQR(true);
    } catch (err) {
      console.error("Failed to create QR:", err);
      alert("Failed to create QR. Check console for details.");
    }
  };

  const handleSelectServices = async (services) => {
    try {
      const res = await getGrantToken(services.id);
      const token = res.data.grantToken;
      setLinkedBankInfo({
        fiFullName: services.fiFullName || null,
        logo: services.logo || null
      });
      setGrantToken(token);
      setOpenBankSelect(false);
      openCasLink(token, services.fiFullName, services.logo);

    } catch (err) {
      console.error(err)
    }
  }

  // ------------------ JSX ------------------
  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
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
                <span className="text-sm flex items-center gap-2">
                  {bankLinked ? (
                    <div className="w-full max-w-sm flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2">
                      {/* Logo + tên */}
                      <div className="flex items-center gap-3">
                        {linkedBankInfo.logo && (
                          <img
                            src={linkedBankInfo.logo}
                            alt={linkedBankInfo.fiFullName}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        )}
                        <span className="text-gray-800 font-semibold">{linkedBankInfo.fiFullName || nameBank}</span>
                      </div>

                      {/* Nút Xóa */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="ml-25 px-2 py-1 text-sm"
                        onClick={handleDeleteBank}
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (<div className="text-sm font-medium text-yellow-400">Not linked yet</div>)}
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
                <div className="mt-4 py-2 px-3 border border-border rounded-lg bg-muted/20 flex justify-center">
                  <img
                    src={qrData.link}
                    alt="QR Code"
                    className="w-60 h-60"
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
