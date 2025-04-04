"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

type WalletType = {
  address: string
  balance: string
  type: string
}

type WalletContextType = {
  wallet: WalletType | null
  isConnected: boolean
  isConnecting: boolean
  connect: (walletType: string) => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Check for existing connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet))
      } catch (e) {
        localStorage.removeItem("wallet")
      }
    }
  }, [])

  const connect = async (walletType: string) => {
    setIsConnecting(true)

    try {
      // In a real app, this would connect to the actual wallet
      // For demo purposes, we're just simulating a connection

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mock wallet data
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      const newWallet = {
        address: mockAddress,
        balance: "0.5",
        type: walletType,
      }

      setWallet(newWallet)
      localStorage.setItem("wallet", JSON.stringify(newWallet))

      toast({
        title: "Wallet connected",
        description: `Connected to ${walletType}`,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWallet(null)
    localStorage.removeItem("wallet")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnected: !!wallet,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

