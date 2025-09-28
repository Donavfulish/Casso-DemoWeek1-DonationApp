import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { checkSession } from "../api/sharedApi"

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await checkSession();
                setSession(res)
            } catch (err) {
                console.error(err);
            }
        }
        fetchSession()
    }, [])

    const handleNavigation = async (path, requiresBankLink = false) => {
        if (requiresBankLink) {
            const sessionData = await checkSession()
            if (!sessionData.data.bankLinked) {
                alert("Please link your bank account first!")
                return
            } 
            else navigate(path)
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
