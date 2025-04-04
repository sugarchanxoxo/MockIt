"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sparkles, Repeat } from "lucide-react"

// Mock popular NFTs that can be used as inspiration
const popularNfts = [
  {
    id: 1,
    name: "Cosmic Neural #42",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x1234...5678",
    trend: "Abstract Neural",
    remixes: 24,
  },
  {
    id: 2,
    name: "Pixel Universe #17",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x8765...4321",
    trend: "Pixel Art",
    remixes: 18,
  },
  {
    id: 3,
    name: "Neon Dreams #76",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x2468...1357",
    trend: "Cyberpunk",
    remixes: 32,
  },
  {
    id: 4,
    name: "Data Flow #23",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x1357...2468",
    trend: "Data Visualization",
    remixes: 15,
  },
  {
    id: 5,
    name: "Blockchain Beats #11",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x3691...2580",
    trend: "Audio Visualization",
    remixes: 27,
  },
  {
    id: 6,
    name: "Quantum Quilt #38",
    image: "/placeholder.svg?height=200&width=200",
    creator: "0x2580...3691",
    trend: "Generative Patterns",
    remixes: 21,
  },
]

interface NftInspirationGalleryProps {
  onSelectNft?: (nft: any) => void
}

export function NftInspirationGallery({ onSelectNft }: NftInspirationGalleryProps) {
  const [selectedNft, setSelectedNft] = useState<number | null>(null)

  const handleSelect = (nft: any) => {
    setSelectedNft(nft.id)
    if (onSelectNft) {
      onSelectNft(nft)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Popular NFTs to Remix</h3>
        <Link href="/marketplace">
          <Button variant="link" size="sm" className="text-purple-600">
            View All
          </Button>
        </Link>
      </div>

      <ScrollArea className="w-full pb-4">
        <div className="flex space-x-4">
          {popularNfts.map((nft) => (
            <Card
              key={nft.id}
              className={`flex-shrink-0 w-[200px] cursor-pointer transition-all ${
                selectedNft === nft.id ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => handleSelect(nft)}
            >
              <CardContent className="p-3">
                <div className="relative">
                  <Image
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    width={200}
                    height={200}
                    className="w-full h-auto rounded-md"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-600 flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {nft.remixes}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-sm truncate">{nft.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{nft.trend}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(nft)
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Remix This
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

