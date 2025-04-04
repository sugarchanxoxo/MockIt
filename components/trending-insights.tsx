"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"

// Mock trending data - in a real app, this would come from on-chain data analysis
const trendingData = [
  {
    category: "Art Style",
    trend: "Pixel Art",
    change: "+32%",
    direction: "up",
    description: "8-bit and pixel art styles are seeing a significant rise in popularity and trading volume.",
  },
  {
    category: "Theme",
    trend: "Cyberpunk",
    change: "+24%",
    direction: "up",
    description: "Futuristic dystopian themes with neon aesthetics are trending across collections.",
  },
  {
    category: "Color Palette",
    trend: "Neon Gradients",
    change: "+18%",
    direction: "up",
    description: "Vibrant neon color gradients are dominating the most traded new collections.",
  },
  {
    category: "Subject",
    trend: "Abstract Data",
    change: "+27%",
    direction: "up",
    description: "Visualizations of blockchain data in abstract forms are gaining traction.",
  },
]

export function TrendingInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {trendingData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{item.trend}</CardTitle>
              <Badge variant={item.direction === "up" ? "default" : "destructive"} className="flex items-center">
                {item.direction === "up" ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {item.change}
              </Badge>
            </div>
            <CardDescription>{item.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

