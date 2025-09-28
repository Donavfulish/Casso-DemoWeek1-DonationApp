import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { handleApi } from "../api/handleApi"
import { checkSession } from "../api/session.api"
import { toast } from "react-toastify"

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await handleApi(checkSession()) // 👈 sẽ toast nếu backend trả về message
                setSession(data)
            } catch (err) {
                console.error("Failed to fetch session:", err)
            }
        }
        fetchSession()
    }, [])

    const handleNavigation = async (path, requiresBankLink = false) => {
        if (requiresBankLink) {
            try {
                const data = await handleApi(checkSession())
                if (!data.bankLinked) {
                    toast.error("Please link your bank account first!") // 👈 thay alert
                    return
                }
            } catch (err) {
                console.error("Session check failed:", err)
                return
            }
        }
        navigate(path)
    }

    const isActive = (path) => location.pathname === path

    return (
        <header className="bg-card border-b border-border mb-8">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <nav className="flex justify-center space-x-8">
                    <Button
                        variant={isActive("/dashboard") ? "default" : "ghost"}
                        onClick={() => handleNavigation("/dashboard")}
                        className="text-base font-medium"
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant={isActive("/transactions") ? "default" : "ghost"}
                        onClick={() => handleNavigation("/transactions", true)}
                        className="text-base font-medium"
                    >
                        Transactions History
                    </Button>
                    <Button
                        variant={isActive("/balance") ? "default" : "ghost"}
                        onClick={() => handleNavigation("/balance", true)}
                        className="text-base font-medium"
                    >
                        Account Balance
                    </Button>
                </nav>
            </div>
        </header>
    )
}
