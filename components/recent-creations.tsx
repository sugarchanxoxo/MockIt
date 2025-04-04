"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Clock } from "lucide-react"

// Mock NFT creation history data
const recentNfts = [
  {
    id: 1,
    name: "Cosmic Neural #42",
    image: "/placeholder.svg?height=200&width=200",
    created: "2 days ago",
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
    trend: "Data Visualization",
    status: "Minted",
    views: 56,
    likes: 8,
  },
]

export function RecentCreations() {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-8">
        <TabsTrigger value="all">All Creations</TabsTrigger>
        <TabsTrigger value="minted">Minted</TabsTrigger>
        <TabsTrigger value="listed">Listed</TabsTrigger>
        <TabsTrigger value="sold">Sold</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentNfts.map((nft) => (
            <NftHistoryCard key={nft.id} nft={nft} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="minted">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentNfts
            .filter((nft) => nft.status === "Minted")
            .map((nft) => (
              <NftHistoryCard key={nft.id} nft={nft} />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="listed">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentNfts
            .filter((nft) => nft.status === "Listed")
            .map((nft) => (
              <NftHistoryCard key={nft.id} nft={nft} />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="sold">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentNfts
            .filter((nft) => nft.status === "Sold")
            .map((nft) => (
              <NftHistoryCard key={nft.id} nft={nft} />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function NftHistoryCard({ nft }) {
  return (
    <Link href={`/nfts/${nft.id}`}>
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
                  nft.status === "Minted" ? "bg-blue-500" : nft.status === "Listed" ? "bg-amber-500" : "bg-green-500"
                }
              >
                {nft.status}
              </Badge>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium">{nft.name}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{nft.created}</span>
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
  )
}

