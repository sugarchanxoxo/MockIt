import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Mock theme data - in a real app, this would be dynamic based on trends
const trendingThemes = [
  { id: "pixel", name: "Pixel Art", image: "/placeholder.svg?height=120&width=120" },
  { id: "cyberpunk", name: "Cyberpunk", image: "/placeholder.svg?height=120&width=120" },
  { id: "abstract", name: "Abstract Data", image: "/placeholder.svg?height=120&width=120" },
  { id: "neon", name: "Neon Gradient", image: "/placeholder.svg?height=120&width=120" },
]

export function ThemeShowcase() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 p-2">
        {trendingThemes.map((theme) => (
          <div key={theme.id} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <Image
                src={theme.image || "/placeholder.svg"}
                alt={theme.name}
                width={120}
                height={120}
                className="object-cover transition-all hover:scale-105 aspect-square"
              />
            </div>
            <p className="mt-2 text-sm text-center">{theme.name}</p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

