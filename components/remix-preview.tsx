import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RemixPreviewProps {
  originalNft: any
}

export function RemixPreview({ originalNft }: RemixPreviewProps) {
  if (!originalNft) return null

  return (
    <div className="bg-purple-50 p-4 rounded-lg">
      <h3 className="font-medium text-purple-800 mb-3">Remixing NFT</h3>

      <div className="flex items-center gap-4">
        <div className="w-1/3">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={originalNft.image || "/placeholder.svg"}
                  alt={originalNft.name}
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
                <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-xs">Original</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <ArrowRight className="h-5 w-5 text-purple-400" />

        <div className="w-1/3">
          <div className="aspect-square bg-white rounded-md border border-dashed border-purple-200 flex items-center justify-center">
            <Badge className="bg-purple-600">Your Remix</Badge>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-purple-700">
          Your new NFT will be created based on <span className="font-medium">{originalNft.name}</span> with your
          customizations and AI enhancements.
        </p>
      </div>
    </div>
  )
}

