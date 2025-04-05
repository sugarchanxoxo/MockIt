"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  ImageIcon,
  Sparkles,
  Wallet,
  Plus,
  Info,
  Coins,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWaitForTransactionReceipt } from "wagmi";
import useMultiBaas from "@/hooks/useMultiBaas";

export default function CreateNFT() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState("");
  const [generateError, setGenerateError] = useState("");
  const [activeTab, setActiveTab] = useState("collection");
  const [txHash, setTxHash] = useState<string | null>(null);
  const { mintWithETH, mintWithUSDC } = useMultiBaas();

  const { data: txReceipt, isLoading: isTxProcessing } =
    useWaitForTransactionReceipt({
      hash: txHash ? (txHash as `0x${string}`) : undefined,
    });

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
      setGenerateError(
        error instanceof Error ? error.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMintWithETH = async () => {
    setIsMinting(true);
    const result = await mintWithETH(imageUrl, prompt, 1); // Using 1 as default amount
    alert(result);
    setIsMinting(false);
  };

  const handleMintWithUSDC = async () => {
    setIsMinting(true);
    const result = await mintWithUSDC(imageUrl, prompt, 1);
    alert(result);
    setIsMinting(false);
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
                <ConnectButton />
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
              <Button variant="outline" onClick={() => setActiveTab("create")}>
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
                <CardDescription>
                  Describe what you want to create
                </CardDescription>
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
                  <span>
                    Be descriptive for better results. Include style, colors,
                    and themes.
                  </span>
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
                      <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Generating...
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
                    <p className="text-xs mt-2">
                      This may take up to 30 seconds
                    </p>
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
                  <div
                    className={`w-full p-2 rounded text-center text-sm ${
                      mintStatus.includes("Success")
                        ? "bg-green-100 text-green-800"
                        : mintStatus.includes("Error")
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {mintStatus}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button
                    onClick={handleMintWithETH}
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
                    onClick={handleMintWithUSDC}
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
  );
}
