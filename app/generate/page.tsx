"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles, Zap, Brain, Repeat } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { generateNft } from "@/lib/multibaas"
import { WalletConnect } from "@/components/wallet-connect"
import { FileUpload } from "@/components/file-upload"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NftInspirationGallery } from "@/components/nft-inspiration-gallery"
import { RemixPreview } from "@/components/remix-preview"

const themes = [
  { id: "abstract", name: "Abstract Neural", image: "/placeholder.svg?height=200&width=200", trending: true },
  { id: "pixel", name: "Pixel Art", image: "/placeholder.svg?height=200&width=200", trending: true },
  { id: "cyberpunk", name: "Cyberpunk", image: "/placeholder.svg?height=200&width=200", trending: true },
  { id: "neon", name: "Neon Gradient", image: "/placeholder.svg?height=200&width=200", trending: true },
  { id: "landscape", name: "Landscape", image: "/placeholder.svg?height=200&width=200" },
  { id: "portrait", name: "Portrait", image: "/placeholder.svg?height=200&width=200" },
  { id: "futuristic", name: "Futuristic", image: "/placeholder.svg?height=200&width=200" },
  { id: "retro", name: "Retro", image: "/placeholder.svg?height=200&width=200" },
]

const dataSources = [
  { id: "price", name: "Price Movements", description: "Creates patterns based on recent price fluctuations" },
  { id: "volume", name: "Trading Volume", description: "Uses trading volume data to influence the design" },
  { id: "social", name: "Social Sentiment", description: "Incorporates social media sentiment about NFTs" },
  { id: "defi", name: "DeFi Activity", description: "Based on decentralized finance transaction patterns" },
]

// Mock NFT data for remixing
const mockNfts = [
  {
    id: 1,
    name: "Cosmic Drift #42",
    price: "0.05",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Cosmic Series",
    owner: "0x1234...5678",
    trend: "Abstract Neural",
  },
  {
    id: 2,
    name: "Digital Wave #17",
    price: "0.08",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Wave Patterns",
    owner: "0x8765...4321",
    trend: "Pixel Art",
  },
  {
    id: 3,
    name: "Polygon Pulse #3",
    price: "0.12",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Pulse Collection",
    owner: "0x2468...1357",
    trend: "Cyberpunk",
  },
]

export default function GeneratePage() {
  const { wallet, isConnected } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTheme, setSelectedTheme] = useState("")
  const [selectedDataSource, setSelectedDataSource] = useState("price")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState("")
  const [activeTab, setActiveTab] = useState("theme")
  const [generationSteps, setGenerationSteps] = useState([])
  const [remixNft, setRemixNft] = useState(null)
  const [selectedInspirationNft, setSelectedInspirationNft] = useState(null)

  // Check URL parameters
  useEffect(() => {
    if (searchParams.get("mode") === "upload") {
      setActiveTab("upload")
    } else if (searchParams.get("mode") === "remix") {
      setActiveTab("remix")
    }

    // Check if we're remixing a specific NFT
    const remixId = searchParams.get("remix")
    if (remixId) {
      const nftToRemix = mockNfts.find((nft) => nft.id.toString() === remixId)
      if (nftToRemix) {
        setRemixNft(nftToRemix)
        setActiveTab("remix")
      }
    }
  }, [searchParams])

  const handleGenerate = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to generate NFTs",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "theme" && !selectedTheme) {
      toast({
        title: "No theme selected",
        description: "Please select a theme for your NFT",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "remix" && !remixNft && !selectedInspirationNft) {
      toast({
        title: "No NFT selected",
        description: "Please select an NFT to remix",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationSteps([])

    try {
      // Simulate AI generation steps with progress updates
      const steps = [
        "Analyzing blockchain trends...",
        "Identifying pattern correlations...",
        "Generating base composition...",
        "Applying artistic style...",
        "Finalizing NFT metadata...",
      ]

      // Add remix-specific step if remixing
      if (activeTab === "remix") {
        steps.splice(2, 0, "Extracting features from original NFT...")
      }

      for (let i = 0; i < steps.length; i++) {
        setGenerationSteps((prev) => [...prev, steps[i]])
        setGenerationProgress(((i + 1) / steps.length) * 100)
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      // This would call the actual MultiBaas SDK to generate the NFT
      const sourceNft = remixNft || selectedInspirationNft
      const result = await generateNft(
        wallet.address,
        selectedTheme,
        selectedDataSource,
        sourceNft ? sourceNft.id : null,
      )

      // For demo purposes, we're just setting a placeholder
      setPreviewImage("/placeholder.svg?height=400&width=400")

      toast({
        title: sourceNft ? "Remix Generated Successfully!" : "NFT Generated Successfully!",
        description: sourceNft
          ? "Your remixed NFT is ready to be minted"
          : "Your AI-generated NFT is ready to be minted",
      })

      // In a real app, we would redirect to the NFT detail page
      // router.push(`/nfts/${result.tokenId}`)
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your NFT",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectInspirationNft = (nft) => {
    setSelectedInspirationNft(nft)
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
          AI-Powered
        </Badge>
      </div>
      <h1 className="text-3xl font-bold mb-2">Create Your AI-Generated NFT</h1>
      <p className="text-muted-foreground mb-8">
        Generate unique NFTs based on blockchain trends or remix existing NFTs
      </p>

      {!isConnected ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="mb-4">Connect your wallet to generate NFTs</p>
          <WalletConnect
            buttonProps={{
              size: "lg",
              className: "bg-purple-600 hover:bg-purple-700",
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="theme">Choose Theme</TabsTrigger>
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="remix">Remix NFT</TabsTrigger>
                <TabsTrigger value="data">Data Source</TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all ${selectedTheme === theme.id ? "ring-2 ring-purple-500" : ""}`}
                      onClick={() => setSelectedTheme(theme.id)}
                    >
                      <CardContent className="p-3">
                        <div className="relative">
                          <Image
                            src={theme.image || "/placeholder.svg"}
                            alt={theme.name}
                            width={200}
                            height={200}
                            className="w-full h-auto rounded-md mb-2"
                          />
                          {theme.trending && <Badge className="absolute top-2 right-2 bg-purple-600">Trending</Badge>}
                        </div>
                        <p className="font-medium text-center">{theme.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <div className="max-w-md mx-auto">
                  <FileUpload />
                  <div className="mt-6 bg-purple-50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-purple-800">AI Enhancement</h3>
                        <p className="text-sm text-purple-700 mt-1">
                          Our AI will analyze your image and enhance it with blockchain trend data to create a unique
                          NFT.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="remix" className="mt-6">
                <div className="space-y-6">
                  {remixNft ? (
                    <RemixPreview originalNft={remixNft} />
                  ) : (
                    <>
                      <div className="bg-purple-50 p-4 rounded-md mb-6">
                        <div className="flex items-start gap-3">
                          <Repeat className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-purple-800">Remix Existing NFTs</h3>
                            <p className="text-sm text-purple-700 mt-1">
                              Select an NFT below to remix it with AI. Your new creation will be unique while
                              maintaining elements of the original.
                            </p>
                          </div>
                        </div>
                      </div>

                      <NftInspirationGallery onSelectNft={handleSelectInspirationNft} />

                      {selectedInspirationNft && <RemixPreview originalNft={selectedInspirationNft} />}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <Card
                      key={source.id}
                      className={`cursor-pointer transition-all ${selectedDataSource === source.id ? "ring-2 ring-purple-500" : ""}`}
                      onClick={() => setSelectedDataSource(source.id)}
                    >
                      <CardContent className="p-6">
                        <h3 className="font-medium text-lg">{source.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{source.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              className="w-full mt-8 bg-purple-600 hover:bg-purple-700"
              size="lg"
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                (activeTab === "theme" && !selectedTheme) ||
                (activeTab === "remix" && !remixNft && !selectedInspirationNft)
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI Generating...
                </>
              ) : activeTab === "remix" ? (
                <>
                  <Repeat className="mr-2 h-4 w-4" />
                  Generate Remix with AI
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate NFT with AI
                </>
              )}
            </Button>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Zap className="h-5 w-5 text-purple-600 mr-2" />
              AI Preview
            </h3>

            {isGenerating ? (
              <div className="space-y-4">
                <Progress value={generationProgress} className="h-2" />
                <div className="space-y-2">
                  {generationSteps.map((step, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
                <div className="h-[300px] flex items-center justify-center bg-white rounded-md border border-dashed">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                </div>
              </div>
            ) : previewImage ? (
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="NFT Preview"
                width={400}
                height={400}
                className="w-full h-auto rounded-md"
              />
            ) : (
              <div className="h-[300px] bg-white rounded-md border border-dashed flex flex-col items-center justify-center">
                <Brain className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-muted-foreground text-center px-6">
                  {activeTab === "theme"
                    ? "Select a theme and click Generate to create your AI NFT"
                    : activeTab === "upload"
                      ? "Upload an image for AI enhancement"
                      : activeTab === "remix"
                        ? "Select an NFT to remix with AI"
                        : "Select a data source for your AI-generated NFT"}
                </p>
              </div>
            )}

            {!isGenerating && previewImage && (
              <div className="mt-4 bg-purple-50 p-4 rounded-md">
                <h4 className="font-medium text-purple-800 mb-2">AI Generation Complete</h4>
                <p className="text-sm text-purple-700">
                  {activeTab === "remix"
                    ? "Your unique remixed NFT has been generated based on the original NFT and blockchain trends."
                    : "Your unique NFT has been generated based on blockchain trends and your selected parameters."}
                </p>
                <div className="mt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Mint NFT Now</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

