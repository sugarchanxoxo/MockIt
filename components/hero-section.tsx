import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="relative h-[600px] w-full">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="AI NFT Platform Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-white text-sm font-medium">AI-Powered NFT Creation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Create Stunning NFTs in Seconds with AI</h1>
            <p className="text-lg text-gray-200 mb-8">
              Our AI analyzes blockchain trends to generate unique, valuable NFTs. Create, track, and trade your digital
              art collection with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/generate">
                <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Create NFT Now
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-black/50 text-white border-white hover:bg-black/70"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Trending NFTs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

