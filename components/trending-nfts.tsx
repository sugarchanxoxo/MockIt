import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock trending NFT data
const trendingNfts = [
  {
    id: 1,
    name: "Volume Spike #28",
    collection: "Data Trends",
    price: "0.18",
    change: "+24%",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Market Momentum #12",
    collection: "Momentum Series",
    price: "0.22",
    change: "+18%",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Polygon Patterns #7",
    collection: "Pattern Collection",
    price: "0.15",
    change: "+32%",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Chain Activity #45",
    collection: "Activity Series",
    price: "0.11",
    change: "+15%",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export function TrendingNfts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {trendingNfts.map((nft) => (
        <Link href={`/nfts/${nft.id}`} key={nft.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
                <Badge className="absolute top-2 right-2 bg-green-500">{nft.change}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{nft.name}</h3>
                <p className="text-sm text-muted-foreground">{nft.collection}</p>
                <p className="font-semibold mt-2">{nft.price} MATIC</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

