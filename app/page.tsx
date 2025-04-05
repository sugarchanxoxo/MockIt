import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Cpu,
  Database,
  Wallet,
  Sparkles,
  Code,
  Layers,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-br from-purple-900 via-violet-800 to-purple-700 text-white">
        <div className="container mx-auto py-28 px-4">
          <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto">
            <Badge
              className="px-4 py-1.5 text-lg bg-white/20 text-white border-none backdrop-blur-sm"
              variant="outline"
            >
              ✨🐈🤍
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Create AI-Generated NFTs
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
              Generate unique NFTs with AI, track their history on-chain, and
              build upon existing creations. Share your experience 🐰
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <ConnectButton />
              <Button
                size="lg"
                variant="outline"
                className="border-white text-purple-900 hover:bg-white/10"
                asChild
              >
                <Link href="/explore">Explore Creations</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 opacity-10">
          <Sparkles className="h-64 w-64" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Code className="h-48 w-48" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-24 px-4 pb-0">
        <div className="space-y-28">
          {/* Key Features Section */}
          <section className="py-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Key Features?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We offer you need to create, collaborate, and track AI-generated
                NFTs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Database className="h-12 w-12" />}
                title="On-Chain History"
                description="Track the complete history of NFT generation including image data, AI prompts, and creator information."
              />
              <FeatureCard
                icon={<Cpu className="h-12 w-12" />}
                title="AI Collaboration"
                description="Contribute to and build upon existing NFTs using our generative AI technology."
              />
              <FeatureCard
                icon={<Wallet className="h-12 w-12" />}
                title="Flexible Transfers"
                description="Export NFTs outside the platform by paying gas fees with USDC or ETH."
              />
            </div>
          </section>

          {/* Technical Details Section */}
          <section className="py-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Technical Implementation
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with cutting-edge blockchain technology
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Layers className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Contract Standard
                      </h3>
                      <p className="text-muted-foreground">
                        ERC-1155 multi-token standard for efficient batch
                        operations and reduced gas costs
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Code className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Deployment</h3>
                      <p className="text-muted-foreground">
                        MultiBaas SDK for seamless contract deployment and
                        management
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Database className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Data Storage</h3>
                      <p className="text-muted-foreground">
                        PNG data, AI prompts, and user info tracked by contract
                        address
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Wallet className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Payment Options
                      </h3>
                      <p className="text-muted-foreground">
                        Transaction fees payable with USDC (Circle) or ETH
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Supported Chains Section */}
          <section className="py-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Supported Chains
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Deploy your NFTs on these high-performance blockchains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ChainCard
                name="Polygon"
                description="Fast and low-cost transactions with high security. Perfect for NFT projects with high volume."
                isTestnet={true}
                icon="/placeholder.svg?height=80&width=80"
              />
              <ChainCard
                name="Base"
                description="Ethereum L2 with optimistic rollups for scalability. Built for the future of web3."
                isTestnet={false}
                icon="/placeholder.svg?height=80&width=80"
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-purple-50 w-screen relative left-1/2 right-1/2 -mx-[50vw] p-16 pb-20 text-center mb-0">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Create Your NFT?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Start generating unique AI-powered NFTs in seconds
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/create">Get Started</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-2 transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="mb-4 text-primary">{icon}</div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ChainCard({
  name,
  description,
  isTestnet,
  icon,
}: {
  name: string;
  description: string;
  isTestnet: boolean;
  icon: string;
}) {
  // Determine the URL based on chain name
  const getChainUrl = () => {
    if (name === "Polygon") {
      return "https://polygon.technology/blog/introducing-the-amoy-testnet-for-polygon-pos";
    } else if (name === "Base") {
      return "https://docs.base.org/learn/deployment-to-testnet/deployment-to-base-sepolia-sbs";
    }
    return "#";
  };

  return (
    <Card className="border-2 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={icon || "/placeholder.svg"}
              alt={name}
              className="w-12 h-12 rounded-full"
            />
            <CardTitle className="text-2xl">{name}</CardTitle>
          </div>
          {isTestnet && <Badge variant="outline">Testnet</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={getChainUrl()} target="_blank" rel="noopener noreferrer">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
