"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { Sparkles, Repeat, ArrowLeft, ExternalLink, Heart, Eye, Share2 } from "lucide-react"

// Mock NFT data
const mockNfts = {
  1: {
    id: 1,
    name: "Cosmic Drift #42",
    description: "An AI-generated NFT based on cosmic neural patterns and blockchain data trends.",
    price: "0.05",
    image: "/placeholder.svg?height=500&width=500",
    collection: "Cosmic Series",
    owner: "0x1234...5678",
    creator: "0x8765...4321",
    createdAt: "Apr 2, 2023",
    trend: "Abstract Neural",
    views: 124,
    likes: 18,
    remixes: 8,
    isRemix: false,
    originalNft: null,
    remixedNfts: [3, 5],
  },
  2: {
    id: 2,
    name: "Digital Wave #17",
    description: "A pixel art representation of trading volume data from the Polygon blockchain.",
    price: "0.08",
    image: "/placeholder.svg?height=500&width=500",
    collection: "Wave Patterns",
    owner: "0x8765...4321",
    creator: "0x8765...4321",
    createdAt: "Apr 1, 2023",
    trend: "Pixel Art",
    views: 87,
    likes: 12,
    remixes: 3,
    isRemix: false,
    originalNft: null,
    remixedNfts: [],
  },
  3: {
    id: 3,
    name: "Polygon Pulse #3",
    description: "A remix of Cosmic Drift #42 with cyberpunk elements and DeFi activity data.",
    price: "0.12",
    image: "/placeholder.svg?height=500&width=500",
    collection: "Pulse Collection",
    owner: "0x2468...1357",
    creator: "0x2468...1357",
    createdAt: "Mar 30, 2023",
    trend: "Cyberpunk",
    views: 203,
    likes: 45,
    remixes: 12,
    isRemix: true,
    originalNft: 1,
    remixedNfts: [],
  },
}

export default function NftDetailPage({ params }) {
  const { isConnected } = useWallet()
  const router = useRouter()
  const [nft, setNft] = useState(null)
  const [originalNft, setOriginalNft] = useState(null)
  const [remixedNfts, setRemixedNfts] = useState([])
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch the NFT data from the API
    const nftData = mockNfts[params.id]
    if (nftData) {
      setNft(nftData)

      // Get original NFT if this is a remix
      if (nftData.isRemix && nftData.originalNft) {
        setOriginalNft(mockNfts[nftData.originalNft])
      }

      // Get remixed NFTs if this has been remixed
      if (nftData.remixedNfts && nftData.remixedNfts.length > 0) {
        const remixes = nftData.remixedNfts.map((id) => mockNfts[id]).filter(Boolean)
        setRemixedNfts(remixes)
      }
    }
  }, [params.id])

  const handleRemix = () => {
    router.push(`/generate?remix=${nft.id}`)
  }

  if (!nft) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p>Loading NFT details...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* NFT Image */}
        <div>
          <div className="relative rounded-lg overflow-hidden bg-slate-100">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              width={500}
              height={500}
              className="w-full h-auto"
            />
            {nft.isRemix && (
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-white/80 text-purple-700 border-purple-200">
                  <Repeat className="h-3 w-3 mr-1" />
                  Remix
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {nft.likes + (isLiked ? 1 : 0)}
              </Button>

              <div className="flex items-center text-muted-foreground text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {nft.views} views
              </div>
            </div>

            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* NFT Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="bg-purple-600">{nft.trend}</Badge>
            {nft.remixes > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Repeat className="h-3 w-3" />
                {nft.remixes} Remixes
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{nft.name}</h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span>Created {nft.createdAt}</span>
            <span>•</span>
            <span>Collection: {nft.collection}</span>
          </div>

          <p className="text-muted-foreground mb-6">{nft.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Creator</p>
              <p className="font-medium">{nft.creator}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-medium">{nft.owner}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Price</p>
            <p className="text-3xl font-bold">{nft.price} MATIC</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {isConnected && (
              <>
                <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
                  Buy Now
                </Button>
                <Button variant="outline" size="lg" onClick={handleRemix}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Remix with AI
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Remix Information */}
      <div className="mt-16">
        <Tabs defaultValue={nft.isRemix ? "original" : remixedNfts.length > 0 ? "remixes" : null}>
          <TabsList>
            {nft.isRemix && <TabsTrigger value="original">Original NFT</TabsTrigger>}
            {remixedNfts.length > 0 && <TabsTrigger value="remixes">Remixes ({remixedNfts.length})</TabsTrigger>}
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {nft.isRemix && originalNft && (
            <TabsContent value="original" className="mt-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Original NFT</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4">
                    <Link href={`/nfts/${originalNft.id}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-0">
                          <Image
                            src={originalNft.image || "/placeholder.svg"}
                            alt={originalNft.name}
                            width={200}
                            height={200}
                            className="w-full h-auto"
                          />
                          <div className="p-4">
                            <h4 className="font-medium">{originalNft.name}</h4>
                            <p className="text-sm text-muted-foreground">{originalNft.collection}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  <div className="w-full md:w-3/4">
                    <p className="text-muted-foreground mb-4">
                      This NFT is a remix of {originalNft.name}, created using AI to transform the original with new
                      elements and blockchain data.
                    </p>
                    <Link href={`/nfts/${originalNft.id}`}>
                      <Button variant="outline" size="sm">
                        View Original
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {remixedNfts.length > 0 && (
            <TabsContent value="remixes" className="mt-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Remixes of this NFT</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {remixedNfts.map((remixNft) => (
                    <Link href={`/nfts/${remixNft.id}`} key={remixNft.id}>
                      <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              src={remixNft.image || "/placeholder.svg"}
                              alt={remixNft.name}
                              width={200}
                              height={200}
                              className="w-full h-auto"
                            />
                            <Badge className="absolute top-2 right-2 bg-purple-600 flex items-center gap-1">
                              <Repeat className="h-3 w-3" />
                              Remix
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium">{remixNft.name}</h4>
                            <p className="text-sm text-muted-foreground">{remixNft.trend}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="details" className="mt-6">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">NFT Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Blockchain Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Address</span>
                      <span className="font-mono text-sm">0x1234...5678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono text-sm">{nft.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span>Polygon</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">AI Generation Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Source</span>
                      <span>Trading Volume</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Model</span>
                      <span>Trend Analyzer v2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Generation Time</span>
                      <span>12 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

