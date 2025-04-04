"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, Info, Wallet, CheckCircle2 } from "lucide-react"

export default function TransferNFT() {
  const [selectedNft, setSelectedNft] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("usdc")
  const [transferStatus, setTransferStatus] = useState(null)

  const handleTransfer = () => {
    if (!selectedNft) return

    setTransferStatus("processing")

    // Simulate transfer
    setTimeout(() => {
      setTransferStatus("success")
    }, 3000)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Transfer NFT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Export NFT</CardTitle>
              <CardDescription>Transfer your NFT outside the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nft-select">Select NFT</Label>
                <Select value={selectedNft} onValueChange={setSelectedNft}>
                  <SelectTrigger id="nft-select">
                    <SelectValue placeholder="Choose an NFT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nft1">Cosmic Explorer #1</SelectItem>
                    <SelectItem value="nft2">Digital Dreamscape #7</SelectItem>
                    <SelectItem value="nft3">Neural Network #42</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedNft && (
                <div className="flex flex-col sm:flex-row gap-4 items-center border rounded-lg p-4">
                  <img
                    src="/placeholder.svg?height=150&width=150"
                    alt="Selected NFT"
                    className="rounded-md w-[150px] h-[150px] object-cover"
                  />
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium">
                      {selectedNft === "nft1"
                        ? "Cosmic Explorer #1"
                        : selectedNft === "nft2"
                          ? "Digital Dreamscape #7"
                          : "Neural Network #42"}
                    </h3>
                    <p className="text-sm text-muted-foreground">Created: April 2, 2023</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">AI Generated</Badge>
                      <Badge variant="outline">Polygon</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Currently held by platform on your behalf</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="recipient-address">Recipient Wallet Address</Label>
                <Input id="recipient-address" placeholder="0x..." />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Platform Fee Required</AlertTitle>
                <AlertDescription>
                  Transferring NFTs outside the platform requires payment of a platform fee. This fee helps maintain the
                  platform and supports creators.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="payment">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="payment">Payment Method</TabsTrigger>
                  <TabsTrigger value="history">Transfer History</TabsTrigger>
                </TabsList>

                <TabsContent value="payment" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Fee Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USDC (Circle)</SelectItem>
                        <SelectItem value="eth">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 border rounded-lg p-4">
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>{paymentMethod === "usdc" ? "5.00 USDC" : "0.003 ETH"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Fee (estimated):</span>
                      <span>{paymentMethod === "usdc" ? "2.50 USDC" : "0.0015 ETH"}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t mt-2">
                      <span>Total:</span>
                      <span>{paymentMethod === "usdc" ? "7.50 USDC" : "0.0045 ETH"}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">View the history of your NFT transfers</p>

                    <div className="border rounded-lg divide-y">
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Pixel Dream #3</p>
                          <p className="text-sm text-muted-foreground">March 15, 2023</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Abstract Motion #8</p>
                          <p className="text-sm text-muted-foreground">February 22, 2023</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleTransfer}
                disabled={!selectedNft || transferStatus === "processing"}
                className="w-full"
              >
                {transferStatus === "processing" ? (
                  "Processing Transfer..."
                ) : (
                  <>
                    Transfer NFT <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Status</CardTitle>
              <CardDescription>Your connected wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span>Connected to MetaMask</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm font-mono truncate">0x1234...5678</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Network:</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Polygon Testnet</Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Balance:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">USDC:</span>
                    <span className="text-sm">100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">MATIC:</span>
                    <span className="text-sm">5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Status</CardTitle>
              <CardDescription>Track your NFT transfer</CardDescription>
            </CardHeader>
            <CardContent>
              {transferStatus === null && (
                <div className="flex flex-col items-center justify-center py-6">
                  <ExternalLink className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Configure and initiate your transfer</p>
                </div>
              )}

              {transferStatus === "processing" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                    <span>Processing transfer...</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indeterminate" />
                  </div>
                  <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                </div>
              )}

              {transferStatus === "success" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Transfer Successful!</span>
                  </div>

                  <div className="space-y-2 border rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                      <span className="text-sm font-mono">0xab1...2cd3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Block Number:</span>
                      <span className="text-sm">12345678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fee Paid:</span>
                      <span className="text-sm">{paymentMethod === "usdc" ? "7.50 USDC" : "0.0045 ETH"}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View on Explorer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

