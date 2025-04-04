import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Palette, Rocket, History } from "lucide-react"

const steps = [
  {
    icon: Brain,
    title: "AI Analyzes Trends",
    description:
      "Our AI scans the blockchain to identify trending styles, themes, and patterns in the NFT marketplace.",
  },
  {
    icon: Palette,
    title: "Choose Your Style",
    description: "Select from AI-recommended themes or upload your own image to combine with blockchain data.",
  },
  {
    icon: Rocket,
    title: "Generate in Seconds",
    description: "Our AI creates your unique NFT in seconds, ready to be minted on the Polygon blockchain.",
  },
  {
    icon: History,
    title: "Track Your Collection",
    description: "Monitor your NFT creation history, track performance, and manage your growing collection.",
  },
]

export function CreationSteps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <step.icon className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">{step.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

