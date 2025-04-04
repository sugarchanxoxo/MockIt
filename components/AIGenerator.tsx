"use client";

import { client } from "@/app/client";
import { useState } from "react";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";
import { contract } from "../utils/contract";
import { upload } from "thirdweb/storage";

export const AIGenerator = () => {
  const account = useActiveAccount();

  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { data: nfts, refetch } = useReadContract(getNFTs, {
    contract: contract,
  });

  const handleGenerateAndMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await res.json();

      const imageBlob = await fetch(data.url).then((res) => res.blob());
      const file = new File([imageBlob], "image.png", { type: "image/png" });
      const imageUri = await upload({
        client: client,
        files: [file],
      });
      setGeneratedImage(imageUri);
      setIsGenerating(false);
      setIsMinting(true);
      const mintRes = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nftImage: imageUri, address: account }),
      });

      if (!mintRes.ok) {
        throw new Error("Failed to mint NFT");
      }

      alert("NFT minted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setImagePrompt("");
      setIsMinting(false);
      setIsGenerating(false);
      refetch();
    }
  };

  if (account) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <ConnectButton client={client} />
        <div style={{ margin: "20px 0" }}>
          {generatedImage ? (
            <MediaRenderer client={client} src={generatedImage} />
          ) : (
            <div>
              <p style={{ color: "gray" }}>
                {isGenerating
                  ? "Generating..."
                  : "Enter a prompot to generate an image"}
              </p>
            </div>
          )}
        </div>
        <div>
          <form onSubmit={handleGenerateAndMint}>
            {!generatedImage || isMinting ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Enter a prompt..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  style={{
                    width: "300px",
                    height: "40px",
                    padding: "0 10px",
                    borderRadius: "5px",
                    border: "1px solid #777",
                    marginBottom: "10px",
                  }}
                />
                <button
                  type="submit"
                  disabled={isGenerating || isMinting || !imagePrompt}
                  style={{
                    width: "300px",
                    height: "40px",
                    backgroundColor: "#333",
                    color: "#fff",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isGenerating
                    ? "Generating..."
                    : isMinting
                    ? "Minting..."
                    : "Generate and Mint NFT"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setGeneratedImage("")}
                style={{
                  width: "300px",
                  height: "40px",
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Generate Another NFT
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
};
