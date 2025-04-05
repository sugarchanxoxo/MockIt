import * as MultiBaas from "@curvegrid/multibaas-sdk";
import { isAxiosError } from "axios";

const config = new MultiBaas.Configuration({
  basePath: "https://o6yosmvwkbdhtp24fvsnuyumie.multibaas.com/api/v0",
  accessToken: process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY,
});
const contractsApi = new MultiBaas.ContractsApi(config);

const chain = "ethereum";
const deployedAddressOrAlias = "multichainnft";
const contractLabel = "multichainnft";
const contractMethod = "mintWithETH";
const payload: MultiBaas.PostMethodArgs = {
  args: ["<INPUT__IMAGEURI>", "<INPUT__PROMPTTEXT>", "<INPUT__AMOUNT>"],
  from: "0x6453F06a9944a6cCB758fA7C0B79953278a6d405",
};

async function mintNFT() {
  try {
    const resp = await contractsApi.callContractFunction(
      chain,
      deployedAddressOrAlias,
      contractLabel,
      contractMethod,
      payload
    );
    console.log("Function call result:\n", resp.data.result);
  } catch (e) {
    if (isAxiosError(e) && e.response?.data) {
      console.log(
        `MultiBaas error with status '${e.response.data.status}' and message: ${e.response.data.message}`
      );
    } else {
      console.log("An unexpected error occurred:", e);
    }
  }
}

// Call the function
mintNFT();
