// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MultichainNFT is ERC1155, Ownable {
    using Strings for uint256;

    // USDC token interface
    IERC20 public usdcToken;

    // Pricing
    uint256 public mintPriceETH = 0.01 ether; // Default ETH price
    uint256 public mintPriceUSDC = 1 * 10 ** 5; // 0.1 USDC (6 decimals)

    // Metadata structure
    struct TokenMetadata {
        string imageURI; // URI for the PNG data
        string promptText; // AI prompt used to generate the image
        address creator; // User who created this token
    }

    // Mapping from token ID to its metadata
    mapping(uint256 => TokenMetadata) public tokenMetadata;

    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Base URI for metadata
    string private _baseURI;

    // Events
    event TokenMinted(uint256 indexed tokenId, address indexed creator, string promptText);
    event PriceUpdated(uint256 newPriceETH, uint256 newPriceUSDC);

    constructor(address _usdcAddress) ERC1155("") Ownable(msg.sender) {
        usdcToken = IERC20(_usdcAddress);
        _baseURI = "";
    }

    /**
     * @dev Mint a new token with ETH payment
     * @param _imageURI URI pointing to the PNG data
     * @param _promptText The AI prompt text used
     * @param _amount Number of tokens to mint
     */
    function mintWithETH(string memory _imageURI, string memory _promptText, uint256 _amount) external payable {
        require(msg.value >= mintPriceETH * _amount, "Insufficient ETH sent");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, tokenId, _amount, "");

        tokenMetadata[tokenId] = TokenMetadata({imageURI: _imageURI, promptText: _promptText, creator: msg.sender});

        emit TokenMinted(tokenId, msg.sender, _promptText);
    }

    function hello() public pure returns (string memory) {
        return "world";
    }

    /**
     * @dev Mint a new token with USDC payment
     * @param _imageURI URI pointing to the PNG data
     * @param _promptText The AI prompt text used
     * @param _amount Number of tokens to mint
     */
    function mintWithUSDC(string memory _imageURI, string memory _promptText, uint256 _amount) external {
        uint256 totalPrice = mintPriceUSDC * _amount;
        require(usdcToken.balanceOf(msg.sender) >= totalPrice, "Insufficient USDC balance");

        // Transfer USDC from the user to the contract
        require(usdcToken.transferFrom(msg.sender, address(this), totalPrice), "USDC transfer failed");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, tokenId, _amount, "");

        tokenMetadata[tokenId] = TokenMetadata({imageURI: _imageURI, promptText: _promptText, creator: msg.sender});

        emit TokenMinted(tokenId, msg.sender, _promptText);
    }

    /**
     * @dev Get the complete metadata for a token
     * @param tokenId The ID of the token
     */
    function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenMetadata[tokenId];
    }

    /**
     * @dev Update minting prices
     * @param newPriceETH New price in ETH
     * @param newPriceUSDC New price in USDC
     */
    function updatePrices(uint256 newPriceETH, uint256 newPriceUSDC) external onlyOwner {
        mintPriceETH = newPriceETH;
        mintPriceUSDC = newPriceUSDC;
        emit PriceUpdated(newPriceETH, newPriceUSDC);
    }

    /**
     * @dev Set the base URI for token metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }

    /**
     * @dev Override URI function to construct token URIs
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }

    /**
     * @dev Check if a token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return bytes(tokenMetadata[tokenId].imageURI).length > 0;
    }

    /**
     * @dev Withdraw ETH from the contract
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Withdraw USDC from the contract
     */
    function withdrawUSDC() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No USDC to withdraw");
        require(usdcToken.transfer(owner(), balance), "USDC transfer failed");
    }

    /**
     * @dev Update the USDC token contract address
     */
    function updateUSDCAddress(address newUSDCAddress) external onlyOwner {
        require(newUSDCAddress != address(0), "Invalid address");
        usdcToken = IERC20(newUSDCAddress);
    }
}
