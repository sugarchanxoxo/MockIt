const deploymentConfig = {
  // Private key of the deployer account, beginning with 0x
  deployerPrivateKey: 'fbaf955d865fa0d860b7e656e674eb0eca74d0ecabccff12e2c92306a5f9820e',

  // Full URL such as https://abc123.multibaas.com
  deploymentEndpoint: 'https://o6yosmvwkbdhtp24fvsnuyumie.multibaas.com',

  // API key to access MultiBaas web3 endpoint
  // Note that the API key MUST be part of the "Web3" group
  // Create one on MultiBaas via navigation bar > Admin > API Keys
  // web3Key:

  // RPC URL of the blockchain network is required if a web3Key is not provided
  // This is required for networks that where MultiBaas does not support the web3 proxy feature
  rpcUrl: 'https://base-sepolia-rpc.publicnode.com',

  // API key to access MultiBaas from deployer
  // Note that the API key MUST be part of the "Administrators" group
  // Create one on MultiBaas via navigation bar > Admin > API Keys
  adminApiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQzODI4MTY3LCJqdGkiOiI1MzMzNjM0ZS0zODg0LTQ3MWItYjJhMC0yZDZhMWIyNzdlODYifQ.ZkKN9l5zTl00gkihZfKgb7L4Ur26NuC8BfjRfuTN0-E',
};

module.exports = {
  deploymentConfig,
};
