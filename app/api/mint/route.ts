import { NextRequest, NextResponse } from "next/server";

import { nftCollectionContractAddress } from "../../../../utils/contract";

const { ENGINE_URL, THIRDWE_SECRET_KEY, BACKEND_WALLET_ADDRESS, CHAIN_ID } =
  process.env;

export async function POST(req: NextRequest) {
  if (
    !ENGINE_URL ||
    !THIRDWE_SECRET_KEY ||
    !BACKEND_WALLET_ADDRESS ||
    !CHAIN_ID
  ) {
    return {
      status: 500,
      body: "Internal server error",
    };
  }

  const { nftImage, address } = await req.json();

  try {
    const res = await fetch(
      `${ENGINE_URL}/contract/${CHAIN_ID}/${nftCollectionContractAddress}/erc721/mint-to`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${THIRDWE_SECRET_KEY}`,
          "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
        },
        body: JSON.stringify({
          reciever: address,
          metadata: {
            name: "AI NFT",
            description: "AI generated NFT",
            image: nftImage,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to mint NFT");
    }

    return new NextResponse(
      JSON.stringify({ message: "NFT minted successfully" })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "Failed to mint NFT" }), {
      status: 500,
    });
  }
}
