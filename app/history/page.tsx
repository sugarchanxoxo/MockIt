"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, DollarSign, Search, Filter, History } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnect } from "@/components/wallet-connect"

// Mock NFT creation history data
const historyNfts = [
  {
    id: 1,
    name: "Cosmic Neural #42",
    image: "/placeholder.svg?height=200&width=200",
    created: "2 days ago",
    date: "Apr 2, 2023",
    trend: "Abstract Neural",
    status: "Minted",
    views: 124,
    likes: 18,
  },
  {
    id: 2,
    name: "Pixel Universe #17",
    image: "/placeholder.svg?height=200&width=200",
    created: "3 days ago",
    date: "Apr 1, 2023",
    trend: "Pixel Art",
    status: "Listed",
    price: "0.05 MATIC",
    views: 87,
    likes: 12,
  },
  {
    id: 3,
    name: "Neon Dreams #76",
    image: "/placeholder.svg?height=200&width=200",
    created: "5 days ago",
    date: "Mar 30, 2023",
    trend: "Cyberpunk",
    status: "Sold",
    price: "0.12 MATIC",
    views: 203,
    likes: 45,
  },
  {
    id: 4,
    name: "Data Flow #23",
    image: "/placeholder.svg?height=200&width=200",
    created: "1 week ago",
    date: "Mar 28, 2023",
    trend: "Data Visualization",
    status: "Minted",
    views: 56,
    likes: 8,
  },
  {
    id: 5,
    name: "Blockchain Beats #11",
    image: "/placeholder.svg?height=200&width=200",
    created: "1 week ago",
    date: "Mar 27, 2023",
    trend: "Audio Visualization",
    status: "Listed",
    price: "0.08 MATIC",
    views: 92,
    likes: 15,
  },
  {
    id: 6,
    name: "Quantum Quilt #38",
    image: "/placeholder.svg?height=200&width=200",
    created: "2 weeks ago",
    date: "Mar 22, 2023",
    trend: "Generative Patterns",
    status: "Sold",
    price: "0.15 MATIC",
    views: 178,
    likes: 32,
  },
  {
    id: 7,
    name: "Digital Dreamscape #54",
    image: "/placeholder.svg?height=200&width=200",
    created: "2 weeks ago",
    date: "Mar 20, 2023",
    trend: "Landscape",
    status: "Minted",
    views: 64,
    likes: 11,
  },
  {
    id: 8,
    name: "Crypto Creature #29",
    image: "/placeholder.svg?height=200&width=200",
    created: "3 weeks ago",
    date: "Mar 15, 2023",
    trend: "Character Design",
    status: "Listed",
    price: "0.07 MATIC",
    views: 112,
    likes: 24,
  },
]

export default function HistoryPage() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredNfts = historyNfts.filter((nft) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.trend.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter === "all" || nft.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <History className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your NFT Creation History</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Connect your wallet to view your NFT creation history and track your collection
        </p>
        <WalletConnect
          buttonProps={{
            size: "lg",
            className: "bg-purple-600 hover:bg-purple-700",
          }}
        />
      </div>
    )
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="h-5 w-5 text-purple-500" />
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
          Creation History
        </Badge>
      </div>
      <h1 className="text-3xl font-bold mb-8">Your NFT Creation History</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or trend..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="minted">Minted</SelectItem>
              <SelectItem value="listed">Listed</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link href="/generate">
          <Button className="bg-purple-600 hover:bg-purple-700">Create New NFT</Button>
        </Link>
      </div>

      {filteredNfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNfts.map((nft) => (
            <Link href={`/nfts/${nft.id}`} key={nft.id}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          nft.status === "Minted"
                            ? "bg-blue-500"
                            : nft.status === "Listed"
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }
                      >
                        {nft.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium">{nft.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{nft.date}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{nft.trend}</span>
                      </div>

                      {nft.price && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3 mr-1" />
                          <span>{nft.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-3 pt-0 border-t text-xs text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <span>{nft.views} views</span>
                    <span>{nft.likes} likes</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">No NFTs found matching your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </main>
  )
}

