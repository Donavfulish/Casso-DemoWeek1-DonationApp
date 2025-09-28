import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"
import LiveTransactionFeed from "../components/LiveTransactionFeed"
import BankSelectModal from "../components/BankSelectModal"
import Header from "../components/Header"
import LinkedBankItem from "../components/LinkedBankItem"
import TestPaymentQRCard from "../components/TestPaymentCard"
import { toast } from "react-toastify"

// API modules
import { getGrantToken, exchangeToken, removeGrant } from "../api/token.api"
import { getListServices } from "../api/service.api"
import { checkSession } from "../api/session.api"
import { handleApi } from "../api/handleApi"

export default function DashboardPage() {
  const [bankLinked, setBankLinked] = useState(false)
  const [isOpenBankSelect, setOpenBankSelect] = useState(false)
  const [serviceList, setServiceList] = useState([])
  const [linkedBanks, setLinkedBanks] = useState([]);

  // ------------------ Load Services ------------------
  useEffect(() => {
    handleApi(getListServices()).then((data) => {
      setServiceList(data || [])
    })
  }, [])

  // ------------------ Check Session ------------------
  const fetchSession = async () => {
    try {
      const data = await handleApi(checkSession())
      setBankLinked((data.accounts || []).length > 0)
      setLinkedBanks(data.accounts || [])
    } catch {
      setBankLinked(false)
      setLinkedBanks([])
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])


  // ------------------ CasLink ------------------
  const openCasLink = (token, fiFullName, logo) => {
    if (!token) {
      toast.error("Chưa có grantToken, vui lòng thử lại!");
      return;
    }

    const CasLinkConfigs = {
      redirectUri: "http://localhost:5173/dashboard",
      iframe: true,
      grantToken: token,
      feature: "qrpay",
      fiServiceType: "ALL",
      onSuccess: async (publicToken) => {
        try {
          const data = await handleApi(exchangeToken({ publicToken, fiFullName, logo }))
          if (data.success) {
            await fetchSession()
          }
        } catch (e) {
          console.error("Exchange token failed", e)
        }
      },
      onExit: () => {},
    }

    const { open } = BankHub.useBankHubLink(CasLinkConfigs);
    open();
  };

  // ------------------ Handlers ------------------
  const handleLinkBank = async () => setOpenBankSelect(true);

  const handleDeleteBank = async (bank) => {
    try {
      await handleApi(removeGrant(bank.fiServiceId, bank.accountNumber))
      setLinkedBanks((prev) => prev.filter((b) => !(b.fiServiceId === bank.fiServiceId && b.accountNumber === bank.accountNumber)))
      setBankLinked((prev) => prev && linkedBanks.length > 1) 
    } catch (err) {
      console.error("Failed to remove bank:", err)
    }
  }

  const handleSelectServices = async (services) => {
    try {
      const data = await handleApi(getGrantToken(services.id))
      const token = data.grantToken
      setOpenBankSelect(false)
      openCasLink(token, services.fiFullName, services.logo)
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
              <div className="text-sm">
                {linkedBanks.length > 0 ? (
                  <div className="space-y-2">
                    {linkedBanks.map((bank, idx) => (
                      <LinkedBankItem
                        key={idx}
                        bank={bank}
                        onDelete={handleDeleteBank}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-yellow-400">Not linked yet</div>
                )}
              </div>
              <Button onClick={handleLinkBank} className="w-full">
                {bankLinked ? "Link Another Account" : "Link Bank Account"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 & 3: Test Payment QR */}
          <TestPaymentQRCard linkedBanks={linkedBanks} />
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
