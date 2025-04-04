"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Code, Database, Info, Rocket } from "lucide-react"

export default function DeployContract() {
  const [contractName, setContractName] = useState("")
  const [deploymentChain, setDeploymentChain] = useState("polygon")
  const [deploymentStatus, setDeploymentStatus] = useState(null)

  const handleDeploy = () => {
    if (!contractName) return

    setDeploymentStatus("deploying")

    // Simulate deployment
    setTimeout(() => {
      setDeploymentStatus("success")
    }, 3000)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold">Deploy ERC-1155 Contract</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Deploy your NFT contract using MultiBaas SDK to Polygon or Base blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract Configuration</CardTitle>
              <CardDescription>Set up your ERC-1155 NFT contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="royalties">Royalties</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-name">Contract Name</Label>
                    <Input
                      id="contract-name"
                      placeholder="MyNFTCollection"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract-symbol">Contract Symbol</Label>
                    <Input id="contract-symbol" placeholder="MNFT" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract-description">Description</Label>
                    <Textarea
                      id="contract-description"
                      placeholder="Describe your NFT collection..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deployment-chain">Deployment Chain</Label>
                    <Select value={deploymentChain} onValueChange={setDeploymentChain}>
                      <SelectTrigger id="deployment-chain">
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="polygon">Polygon Testnet</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-uri">Base URI</Label>
                    <Input id="base-uri" placeholder="https://api.example.com/metadata/" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-supply">Max Supply (0 for unlimited)</Label>
                    <Input id="max-supply" type="number" placeholder="0" />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>On-Chain Data Storage</AlertTitle>
                    <AlertDescription>
                      This contract will store PNG data, AI prompts, and user info on-chain, tracked by contract
                      address.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="royalties" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="royalty-percentage">Royalty Percentage</Label>
                    <Input id="royalty-percentage" type="number" placeholder="5" />
                    <p className="text-sm text-muted-foreground">
                      Percentage of secondary sales that goes to the creator
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="royalty-address">Royalty Recipient Address</Label>
                    <Input id="royalty-address" placeholder="0x..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee Percentage</Label>
                    <Input id="platform-fee" type="number" placeholder="2.5" />
                    <p className="text-sm text-muted-foreground">
                      Fee charged when NFTs are transferred outside the platform
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDeploy}
                disabled={!contractName || deploymentStatus === "deploying"}
                className="w-full"
              >
                {deploymentStatus === "deploying" ? (
                  "Deploying..."
                ) : (
                  <>
                    Deploy Contract <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MultiBaas SDK</CardTitle>
              <CardDescription>Contract deployment tool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Connected to MultiBaas</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Chain:</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{deploymentChain === "polygon" ? "Polygon Testnet" : "Base"}</Badge>
                  {deploymentChain === "polygon" && (
                    <span className="text-xs text-muted-foreground">Mumbai Testnet</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Contract Type:</p>
                <div className="flex items-center space-x-2">
                  <Badge>ERC-1155</Badge>
                  <span className="text-xs text-muted-foreground">Multi-token standard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
              <CardDescription>Track your contract deployment</CardDescription>
            </CardHeader>
            <CardContent>
              {deploymentStatus === null && (
                <div className="flex flex-col items-center justify-center py-6">
                  <Code className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Configure and deploy your contract</p>
                </div>
              )}

              {deploymentStatus === "deploying" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                    <span>Deploying contract...</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indeterminate" />
                  </div>
                  <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                </div>
              )}

              {deploymentStatus === "success" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Deployment Successful!</span>
                  </div>

                  <div className="space-y-2 border rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Contract Address:</span>
                      <span className="text-sm font-mono">0x1a2...3b4c</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                      <span className="text-sm font-mono">0xab1...2cd3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Block Number:</span>
                      <span className="text-sm">12345678</span>
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

