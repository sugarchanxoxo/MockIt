"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Repeat } from "lucide-react"

interface NftCardProps {
  nft: any
  showRemixButton?: boolean
  onRemix?: (nft: any) => void
}

export function NftCard({ nft, showRemixButton = false, onRemix }: NftCardProps) {
  const handleRemix = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onRemix) {
      onRemix(nft)
    }
  }

  return (
    <Link href={`/nfts/${nft.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              width={300}
              height={300}
              className="w-full h-auto"
            />
            {nft.status && (
              <div className="absolute top-2 right-2">
                <Badge
                  className={
                    nft.status === "Minted" ? "bg-blue-500" : nft.status === "Listed" ? "bg-amber-500" : "bg-green-500"
                  }
                >
                  {nft.status}
                </Badge>
              </div>
            )}

            {nft.isRemix && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white/80 text-purple-700 border-purple-200">
                  <Repeat className="h-3 w-3 mr-1" />
                  Remix
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium">{nft.name}</h3>
            {nft.created && (
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <span>{nft.created}</span>
              </div>
            )}

            {nft.trend && (
              <div className="mt-2 text-sm text-muted-foreground">
                <span>{nft.trend}</span>
              </div>
            )}

            {nft.price && <div className="mt-2 font-medium">{nft.price} MATIC</div>}
          </div>
        </CardContent>

        {showRemixButton && (
          <CardFooter className="p-3 pt-0 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={handleRemix}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Remix This NFT
            </Button>
          </CardFooter>
        )}

        {nft.views && nft.likes && (
          <CardFooter className="p-3 pt-0 border-t text-xs text-muted-foreground">
            <div className="flex justify-between w-full">
              <span>{nft.views} views</span>
              <span>{nft.likes} likes</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

