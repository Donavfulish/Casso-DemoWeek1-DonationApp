import { useEffect, useState } from "react"
import LiveTransactionFeed from "../components/LiveTransactionFeed"
import BankSelectModal from "../components/BankSelectModal"
import Header from "../components/Header"
import TestPaymentQRCard from "../components/TestPaymentCard"
import { toast } from "react-toastify"
import { io } from "socket.io-client";
import LinkBankSection from "../components/LinkBankSection"
import ShareCodeSection from "../components/ShareCodeSection"
// API modules
import { getGrantToken, exchangeToken, removeGrant } from "../api/token.api"
import { getListServices } from "../api/service.api"
import { checkSession } from "../api/session.api"
import { handleApi } from "../api/handleApi"
import { createRoom } from "../api/room.api"

export default function DashboardPage() {
  const [bankLinked, setBankLinked] = useState(false)
  const [isOpenBankSelect, setOpenBankSelect] = useState(false)
  const [serviceList, setServiceList] = useState([])
  const [linkedBanks, setLinkedBanks] = useState([]);
  const [removedAccount, setRemovedAccount] = useState(null);
  const [roomCode, setRoomCode] = useState(null);


  // ------------------ Socket ------------------
  useEffect(() => {
    const socket = io("https://bobette-membranous-supervoluminously.ngrok-free.dev", {
      transports: ["websocket"],
    })

    socket.on("remove_account", (removedAccount) => {
      setLinkedBanks((prev) =>
        prev.filter(
          (b) =>
            !(
              b.fiServiceId === removedAccount.fiServiceId &&
              b.accountNumber === removedAccount.accountNumber
            )
        )
      );
      setRemovedAccount(removedAccount);
      console.log(removedAccount);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (removedAccount) {
      toast.info(`Tài khoản ${removedAccount.accountNumber} đã bị xóa cấp quyền`);
      setRemovedAccount(null); // reset để tránh toast lặp lại
    }
  }, [removedAccount]);

  // ------------------ Load Services ------------------
  useEffect(() => {
    handleApi(getListServices()).then((data) => {
      setServiceList(data || [])
    })
  }, [])

  // ------------------ Create Room Code ------------------
  useEffect(() => {
    const initRoom = async () => {
      try {
        const res = await handleApi(createRoom())
        console.log(res);
        if (res.success) {
          setRoomCode(res.data.donation_code)
        }
      } catch (err) {
        console.error("Failed to create room:", err)
      }
    }

    initRoom()
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
      onExit: () => { },
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
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your QR-Donate account</p>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-6 w-1/2 ">
            {/* Step 1: Link Bank Account */}
            <LinkBankSection
              bankLinked={bankLinked}
              linkedBanks={linkedBanks}
              onDeleteBank={handleDeleteBank}
              onLinkBank={handleLinkBank}
            />
            {/* Step 2 & 3: Test Payment QR */}
            <TestPaymentQRCard linkedBanks={linkedBanks} />
          </div>

          {/* Step 4: Live Transaction Feed */}
          <div className="flex flex-col gap-6 w-1/2">
            <ShareCodeSection roomCode={roomCode}/>
            <LiveTransactionFeed linkedBanks={linkedBanks} />
          </div>
        </div>
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
