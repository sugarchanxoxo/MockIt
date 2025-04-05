"use client";
import type {
  PostMethodArgs,
  MethodCallResponse,
  TransactionToSignResponse,
  Event,
} from "@curvegrid/multibaas-sdk";
import type { SendTransactionParameters } from "@wagmi/core";
import {
  Configuration,
  ContractsApi,
  EventsApi,
  ChainsApi,
} from "@curvegrid/multibaas-sdk";
import { useAccount } from "wagmi";
import { useCallback, useMemo } from "react";

interface ChainStatus {
  chainID: number;
  blockNumber: number;
}

interface MultiBaasHook {
  mintWithETH: (
    imageURI: string,
    promptText: string,
    amount: number
  ) => Promise<string>;
  mintWithUSDC: (
    imageURI: string,
    promptText: string,
    amount: number
  ) => Promise<string>;
}

const useMultiBaas = (): MultiBaasHook => {
  const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || "";
  const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY || "";
  const contractLabel =
    process.env.NEXT_PUBLIC_MULTIBAAS_VOTING_CONTRACT_LABEL || "";
  const contractAddressAlias =
    process.env.NEXT_PUBLIC_MULTIBAAS_VOTING_ADDRESS_ALIAS || "";

  const chain = "ethereum";

  // Memoize mbConfig
  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL("/api/v0", mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);
  // Memoize Api
  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const eventsApi = useMemo(() => new EventsApi(mbConfig), [mbConfig]);
  const chainsApi = useMemo(() => new ChainsApi(mbConfig), [mbConfig]);

  const { address, isConnected } = useAccount();

  const getChainStatus = async (): Promise<ChainStatus | null> => {
    try {
      const response = await chainsApi.getChainStatus(chain);
      return response.data.result as ChainStatus;
    } catch (err) {
      console.error("Error getting chain status:", err);
      return null;
    }
  };

  const callContractFunction = useCallback(
    async (
      methodName: string,
      args: PostMethodArgs["args"] = []
    ): Promise<
      MethodCallResponse["output"] | TransactionToSignResponse["tx"]
    > => {
      const payload: PostMethodArgs = {
        args,
        contractOverride: true,
        ...(isConnected && address ? { from: address } : {}),
      };

      const response = await contractsApi.callContractFunction(
        chain,
        contractLabel,
        contractAddressAlias,
        methodName,
        payload
      );

      if (response.data.result.kind === "MethodCallResponse") {
        return response.data.result.output;
      } else if (response.data.result.kind === "TransactionToSignResponse") {
        return response.data.result.tx;
      } else {
        throw new Error(
          `Unexpected response type: ${response.data.result.kind}`
        );
      }
    },
    [
      contractsApi,
      chain,
      contractLabel,
      contractAddressAlias,
      isConnected,
      address,
    ]
  );

  const clearInput =
    useCallback(async (): Promise<SendTransactionParameters> => {
      return await callContractFunction("clearInput");
    }, [callContractFunction]);

  const mintWithETH = useCallback(
    async (
      imageURI: string,
      promptText: string,
      amount: number
    ): Promise<string> => {
      try {
        const mint = await callContractFunction("mintWithETH");
        return mint;
      } catch (err) {
        console.error("Error getting votes:", err);
        return "";
      }
    },
    [callContractFunction]
  );

  const mintWithUSDC = useCallback(
    async (
      imageURI: string,
      promptText: string,
      amount: number
    ): Promise<string> => {
      try {
        const mint = await callContractFunction("mintWithUSDC");
        return mint;
      } catch (err) {
        console.error("Error getting votes:", err);
        return "";
      }
    },
    [callContractFunction]
  );

  return {
    mintWithETH,
    mintWithUSDC,
  };
};

export default useMultiBaas;
