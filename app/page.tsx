import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { AiGeneratedExamples } from "@/components/ai-generated-examples"
import { CreationSteps } from "@/components/creation-steps"
import { RecentCreations } from "@/components/recent-creations"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Zap, History } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* AI-Generated Examples */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
              AI-Powered
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Create NFTs in Seconds with AI</h2>
          <p className="text-muted-foreground max-w-2xl">
            Our AI analyzes on-chain trends and generates unique NFTs that stand out in the marketplace. No design
            skills needed!
          </p>
        </div>

        <AiGeneratedExamples />

        <div className="mt-10 text-center">
          <Link href="/generate">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your NFT Now
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Fast, Fun, and Powered by AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create unique NFTs in just a few clicks and track your creation history
            </p>
          </div>

          <CreationSteps />
        </div>
      </section>

      {/* Track Your NFT History */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="h-5 w-5 text-indigo-500" />
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium">
                Track Your Creations
              </Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your NFT Creation History</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Keep track of all your AI-generated NFTs and their performance on the blockchain
            </p>
          </div>

          <Link href="/history">
            <Button variant="outline">
              View All History
              <Clock className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <RecentCreations />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your First AI-Generated NFT?</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are using AI to generate unique NFTs based on blockchain trends. No design
            skills required!
          </p>
          <Link href="/generate">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
              <Zap className="mr-2 h-4 w-4" />
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

