"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, LogOut } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import Image from "next/image"

interface WalletConnectProps {
  buttonProps?: React.ComponentProps<typeof Button>
  buttonText?: string
}

export function WalletConnect({ buttonProps, buttonText = "Connect Wallet" }: WalletConnectProps) {
  const { connect, disconnect, isConnected, wallet } = useWallet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleConnect = async (walletType: string) => {
    await connect(walletType)
    setIsDialogOpen(false)
  }

  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
          </span>
          <span className="sm:hidden">{wallet.address.substring(0, 4)}...</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={disconnect} title="Disconnect wallet">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Choose a wallet to connect to our platform</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={() => handleConnect("metamask")} className="flex items-center justify-start gap-3">
            <Image src="/placeholder.svg?height=24&width=24" alt="MetaMask" width={24} height={24} />
            MetaMask
          </Button>
          <Button onClick={() => handleConnect("walletconnect")} className="flex items-center justify-start gap-3">
            <Image src="/placeholder.svg?height=24&width=24" alt="WalletConnect" width={24} height={24} />
            WalletConnect
          </Button>
          <Button onClick={() => handleConnect("coinbase")} className="flex items-center justify-start gap-3">
            <Image src="/placeholder.svg?height=24&width=24" alt="Coinbase Wallet" width={24} height={24} />
            Coinbase Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

