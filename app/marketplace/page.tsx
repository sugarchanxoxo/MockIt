"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { NftFilters } from "@/components/nft-filters"
import { WalletConnect } from "@/components/wallet-connect"
import { NftCard } from "@/components/nft-card"
import { Sparkles, Search } from "lucide-react"

// Mock NFT data - in a real app, this would come from the MultiBaas API
const mockNfts = [
  {
    id: 1,
    name: "Cosmic Drift #42",
    price: "0.05",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Cosmic Series",
    owner: "0x1234...5678",
    trend: "Abstract Neural",
    remixes: 8,
    isRemix: false,
  },
  {
    id: 2,
    name: "Digital Wave #17",
    price: "0.08",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Wave Patterns",
    owner: "0x8765...4321",
    trend: "Pixel Art",
    remixes: 3,
    isRemix: false,
  },
  {
    id: 3,
    name: "Polygon Pulse #3",
    price: "0.12",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Pulse Collection",
    owner: "0x2468...1357",
    trend: "Cyberpunk",
    remixes: 12,
    isRemix: true,
  },
  {
    id: 4,
    name: "Chain Data #99",
    price: "0.03",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Data Visualized",
    owner: "0x1357...2468",
    trend: "Data Visualization",
    remixes: 2,
    isRemix: false,
  },
  {
    id: 5,
    name: "Trend Tracker #7",
    price: "0.15",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Trend Series",
    owner: "0x3691...2580",
    trend: "Audio Visualization",
    remixes: 5,
    isRemix: true,
  },
  {
    id: 6,
    name: "Market Mood #21",
    price: "0.07",
    image: "/placeholder.svg?height=300&width=300",
    collection: "Mood Collection",
    owner: "0x2580...3691",
    trend: "Generative Patterns",
    remixes: 0,
    isRemix: false,
  },
]

export default function MarketplacePage() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNfts, setFilteredNfts] = useState(mockNfts)
  const router = useRouter()

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query) {
      setFilteredNfts(mockNfts)
      return
    }

    const filtered = mockNfts.filter(
      (nft) =>
        nft.name.toLowerCase().includes(query) ||
        nft.collection.toLowerCase().includes(query) ||
        nft.trend.toLowerCase().includes(query),
    )
    setFilteredNfts(filtered)
  }

  const handleRemix = (nft) => {
    router.push(`/generate?remix=${nft.id}`)
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">NFT Marketplace</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search NFTs by name, collection, or trend..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10"
          />
        </div>

        <div className="w-full md:w-1/3 flex justify-end">
          {isConnected ? (
            <Link href="/generate">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Create New NFT
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Connect to trade</p>
              <WalletConnect
                buttonProps={{
                  className: "bg-purple-600 hover:bg-purple-700",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <NftFilters />
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All NFTs</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="remixes">Remixes</TabsTrigger>
              {isConnected && <TabsTrigger value="owned">My NFTs</TabsTrigger>}
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNfts.map((nft) => (
                  <NftCard key={nft.id} nft={nft} showRemixButton={isConnected} onRemix={handleRemix} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNfts.slice(0, 3).map((nft) => (
                  <NftCard key={nft.id} nft={nft} showRemixButton={isConnected} onRemix={handleRemix} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="remixes">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNfts
                  .filter((nft) => nft.isRemix)
                  .map((nft) => (
                    <NftCard key={nft.id} nft={nft} showRemixButton={isConnected} onRemix={handleRemix} />
                  ))}
              </div>
            </TabsContent>

            {isConnected && (
              <TabsContent value="owned">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNfts.slice(3, 6).map((nft) => (
                    <NftCard key={nft.id} nft={nft} showRemixButton={true} onRemix={handleRemix} />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </main>
  )
}

