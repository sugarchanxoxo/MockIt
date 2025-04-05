"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, ImageIcon, Sparkles, Wallet, Plus, Info, Coins, Loader } from "lucide-react"
import Link from "next/link"

export default function CreateNFT() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState("");
  const [generateError, setGenerateError] = useState("");
  const [activeTab, setActiveTab] = useState("collection");

  const generateNFT = async () => {
    try {
      setIsGenerating(true);
      setGenerateError("");
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrompt: prompt }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      setGenerateError(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const mintWithETH = async () => {
    try {
      setIsMinting(true);
      setMintStatus("Processing ETH transaction...");
      
      // Contract call would go here
      // Example:
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      // const tx = await contract.mintNFT(imageUrl, prompt, { value: ethers.utils.parseEther("0.01") });
      // await tx.wait();
      
      // Simulate contract call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMintStatus("Success! NFT minted with ETH");
    } catch (error) {
      console.error("Error minting with ETH:", error);
      setMintStatus("Error: Failed to mint NFT with ETH");
    } finally {
      setIsMinting(false);
    }
  };

  const mintWithUSDC = async () => {
    try {
      setIsMinting(true);
      setMintStatus("Processing USDC transaction...");
      
      // Contract calls would go here
      // Example:
      // 1. First approve USDC spending
      // const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      // const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits("10", 6));
      // await approveTx.wait();
      
      // 2. Then mint with USDC
      // const nftContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      // const mintTx = await nftContract.mintNFTWithUSDC(imageUrl, prompt);
      // await mintTx.wait();
      
      // Simulate contract call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMintStatus("Success! NFT minted with USDC");
    } catch (error) {
      console.error("Error minting with USDC:", error);
      setMintStatus("Error: Failed to mint NFT with USDC");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="collection">My Collection</TabsTrigger>
          <TabsTrigger value="create">Create New NFT</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Creation</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Wallet className="h-3 w-3 mr-1" /> 0x1234...5678
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No NFTs created yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Use the "Create New NFT" tab to generate and mint your first NFT
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("create")}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Your First NFT
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <h2 className="text-2xl font-bold">Create New NFT</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Generation</CardTitle>
                <CardDescription>Describe what you want to create</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your NFT in detail..."
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Be descriptive for better results. Include style, colors, and themes.</span>
                </div>
                
                {generateError && (
                  <div className="bg-red-100 text-red-800 p-2 rounded text-sm">
                    {generateError}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={generateNFT} 
                  className="w-full"
                  disabled={!prompt || isGenerating || isMinting}
                >
                  {isGenerating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      Generate Image <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generated NFT</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center min-h-[300px]">
                {isGenerating ? (
                  <div className="text-center text-muted-foreground">
                    <Loader className="mx-auto h-16 w-16 opacity-50 mb-4 animate-spin" />
                    <p>Generating image with Stable Diffusion 3...</p>
                    <p className="text-xs mt-2">This may take up to 30 seconds</p>
                  </div>
                ) : imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Generated NFT" 
                    className="max-h-[300px] rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-16 w-16 opacity-20 mb-2" />
                    <p>Generate an image to preview it here</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                {mintStatus && (
                  <div className={`w-full p-2 rounded text-center text-sm ${
                    mintStatus.includes("Success") 
                      ? "bg-green-100 text-green-800" 
                      : mintStatus.includes("Error") 
                        ? "bg-red-100 text-red-800" 
                        : "bg-blue-100 text-blue-800"
                  }`}>
                    {mintStatus}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button 
                    onClick={mintWithETH} 
                    disabled={!imageUrl || isMinting || isGenerating}
                    className="w-full"
                  >
                    {isMinting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wallet className="mr-2 h-4 w-4" />
                    )}{" "}
                    Mint with ETH
                  </Button>
                  
                  <Button 
                    onClick={mintWithUSDC} 
                    disabled={!imageUrl || isMinting || isGenerating}
                    className="w-full"
                    variant="secondary"
                  >
                    {isMinting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Coins className="mr-2 h-4 w-4" />
                    )}{" "}
                    Mint with USDC
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

