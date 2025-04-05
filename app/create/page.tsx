'use client'

import { useState, useEffect } from 'react'
import { Wallet } from 'ethers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowRight, ImageIcon, Sparkles, Wallet as WalletIcon, Plus, Info } from 'lucide-react'
import { mintNFTWithUSDC } from '@/app/lib/mintNFT'

// Test private key - DO NOT use in production! 0x655155d6EDcB71ebD16b6f09c483a104D3410F94
const TEST_PRIVATE_KEY = '0x2c5cdea134cee1c6d206b52e111286b5d0fccc2ef7860c426247a9543f4c0760'

// Helper function to format wallet address
const formatAddress = (address: string) => {
	if (!address) return ''
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface NFTHistory {
	id: number
	contributor: string
	contributorAvatar: string
	prompt: string
	image: string
	date: string
}

interface NFT {
	id: number
	name: string
	image: string
	creator: string
	creatorName: string
	creatorAvatar: string
	prompt: string
	created: string
	chain: string
	history: NFTHistory[]
}

export default function CreateNFT() {
	const [isWalletConnected, setIsWalletConnected] = useState(false)
	const [walletAddress, setWalletAddress] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isGenerating, setIsGenerating] = useState(false)
	const [selectedNft, setSelectedNft] = useState<NFT | null>(null)
	const [isMinting, setIsMinting] = useState(false)
	const [generatedImage, setGeneratedImage] = useState<string | null>(null)

	// Mock NFT data
	const userNfts = [
		{
			id: 1,
			name: 'Cosmic Explorer #1',
			image: '/placeholder.svg?height=300&width=300',
			creator: '0x1234...5678',
			creatorName: 'ArtistAlpha',
			creatorAvatar: '/placeholder.svg?height=40&width=40',
			prompt: 'A cosmic explorer traveling through nebulas with vibrant purple and blue colors, digital art style',
			created: 'April 2, 2023',
			chain: 'Polygon',
			history: [
				{
					id: 101,
					contributor: 'CryptoArtist42',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Initial concept: A space explorer floating through a nebula with stars and cosmic dust',
					image: '/placeholder.svg?height=200&width=200',
					date: 'March 25, 2023',
				},
				{
					id: 102,
					contributor: 'NebulaDesigner',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: "Added more vibrant colors to the nebula and enhanced the cosmic explorer's suit with glowing elements",
					image: '/placeholder.svg?height=200&width=200',
					date: 'March 28, 2023',
				},
				{
					id: 103,
					contributor: 'ArtistAlpha',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Final version: A cosmic explorer traveling through nebulas with vibrant purple and blue colors, digital art style',
					image: '/placeholder.svg?height=300&width=300',
					date: 'April 2, 2023',
				},
			],
		},
		{
			id: 2,
			name: 'Digital Dreamscape #7',
			image: '/placeholder.svg?height=300&width=300',
			creator: '0x8765...4321',
			creatorName: 'DigitalDreamer',
			creatorAvatar: '/placeholder.svg?height=40&width=40',
			prompt: 'A surreal landscape with floating islands and waterfalls that defy gravity, dreamlike atmosphere',
			created: 'March 15, 2023',
			chain: 'Base',
			history: [
				{
					id: 201,
					contributor: 'DreamWeaver',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Initial sketch: Floating islands with cascading waterfalls in a dreamlike setting',
					image: '/placeholder.svg?height=200&width=200',
					date: 'March 8, 2023',
				},
				{
					id: 202,
					contributor: 'LandscapeArtist',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Added more detail to the islands and enhanced the waterfalls with glowing effects',
					image: '/placeholder.svg?height=200&width=200',
					date: 'March 12, 2023',
				},
				{
					id: 203,
					contributor: 'DigitalDreamer',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Final version: A surreal landscape with floating islands and waterfalls that defy gravity, dreamlike atmosphere',
					image: '/placeholder.svg?height=300&width=300',
					date: 'March 15, 2023',
				},
			],
		},
		{
			id: 3,
			name: 'Neural Network #42',
			image: '/placeholder.svg?height=300&width=300',
			creator: '0x1234...5678',
			creatorName: 'ArtistAlpha',
			creatorAvatar: '/placeholder.svg?height=40&width=40',
			prompt: 'Abstract visualization of a neural network with nodes and connections in neon colors on dark background',
			created: 'February 28, 2023',
			chain: 'Polygon',
			history: [
				{
					id: 301,
					contributor: 'CodeVisualizer',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Initial concept: A basic neural network structure with interconnected nodes',
					image: '/placeholder.svg?height=200&width=200',
					date: 'February 20, 2023',
				},
				{
					id: 302,
					contributor: 'NeonArtist',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Added neon colors to the nodes and connections to enhance the visual appeal',
					image: '/placeholder.svg?height=200&width=200',
					date: 'February 25, 2023',
				},
				{
					id: 303,
					contributor: 'ArtistAlpha',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Final version: Abstract visualization of a neural network with nodes and connections in neon colors on dark background',
					image: '/placeholder.svg?height=300&width=300',
					date: 'February 28, 2023',
				},
			],
		},
		{
			id: 4,
			name: 'Quantum Realm #3',
			image: '/placeholder.svg?height=300&width=300',
			creator: '0x9876...2345',
			creatorName: 'QuantumCreator',
			creatorAvatar: '/placeholder.svg?height=40&width=40',
			prompt: 'Microscopic view of the quantum realm with particles and energy waves in vibrant colors',
			created: 'April 10, 2023',
			chain: 'Base',
			history: [
				{
					id: 401,
					contributor: 'ParticlePainter',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Initial sketch: A microscopic view of particles and energy waves',
					image: '/placeholder.svg?height=200&width=200',
					date: 'April 3, 2023',
				},
				{
					id: 402,
					contributor: 'EnergyArtist',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Enhanced the energy waves with vibrant colors and added more detail to the particles',
					image: '/placeholder.svg?height=200&width=200',
					date: 'April 7, 2023',
				},
				{
					id: 403,
					contributor: 'QuantumCreator',
					contributorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Final version: Microscopic view of the quantum realm with particles and energy waves in vibrant colors',
					image: '/placeholder.svg?height=300&width=300',
					date: 'April 10, 2023',
				},
			],
		},
	]

	useEffect(() => {
		// Auto-connect wallet on component mount
		handleConnectWallet()
	}, [])

	const handleConnectWallet = () => {
		try {
			const wallet = new Wallet(TEST_PRIVATE_KEY)
			setWalletAddress(wallet.address)
			setIsWalletConnected(true)
		} catch (error) {
			console.error('Failed to connect wallet:', error)
		}
	}

	const handleGenerate = () => {
		if (!prompt) return

		setIsGenerating(true)

		// Simulate AI generation
		setTimeout(() => {
			setIsGenerating(false)
			setGeneratedImage('/placeholder.svg?height=300&width=300') // Replace with actual AI generation
		}, 2000)
	}

	const handleMint = async () => {
		if (!walletAddress) return

		try {
			setIsMinting(true)
			const result = await mintNFTWithUSDC({
				privateKey: TEST_PRIVATE_KEY,
				tokenURI: 'https://example.com/nft',
			})

			if (result.success) {
				// Add the new NFT to the collection
				const newNft = {
					id: userNfts.length + 1,
					name: `Test NFT #${userNfts.length + 1}`,
					image: '/placeholder.svg?height=300&width=300',
					creator: walletAddress,
					creatorName: 'You',
					creatorAvatar: '/placeholder.svg?height=40&width=40',
					prompt: 'Test mint without AI generation',
					created: new Date().toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					}),
					chain: 'Base',
					history: [
						{
							id: Date.now(),
							contributor: 'You',
							contributorAvatar: '/placeholder.svg?height=40&width=40',
							prompt: 'Test mint without AI generation',
							image: '/placeholder.svg?height=300&width=300',
							date: new Date().toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							}),
						},
					],
				}

				// Reset the form
				setPrompt('')
				setGeneratedImage('/placeholder.svg?height=300&width=300')
			}
		} catch (error) {
			console.error('Failed to mint NFT:', error)
		} finally {
			setIsMinting(false)
		}
	}

	const handleNftClick = (nft: NFT) => {
		setSelectedNft(nft)
	}

	const handleCloseDialog = () => {
		setSelectedNft(null)
	}

	if (!isWalletConnected) {
		return (
			<div className="container mx-auto py-20 px-4">
				<div className="max-w-md mx-auto text-center">
					<div className="bg-purple-100 p-4 rounded-full inline-block mb-6">
						<WalletIcon className="h-12 w-12 text-purple-700" />
					</div>
					<h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
					<p className="text-muted-foreground mb-8">
						Connect your wallet to view your NFT collection and create new AI-generated NFTs.
					</p>
					<Button size="lg" onClick={handleConnectWallet} className="w-full">
						Connect Wallet
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-10 px-4">
			<div className="flex justify-end mb-4">
				<Badge variant="outline" className="text-sm">
					<WalletIcon className="h-3 w-3 mr-1" /> {formatAddress(walletAddress)}
				</Badge>
			</div>
			<Tabs defaultValue="collection" className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-8">
					<TabsTrigger value="collection">My Collection</TabsTrigger>
					<TabsTrigger value="create">Create New NFT</TabsTrigger>
				</TabsList>

				<TabsContent value="collection" className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">Your NFT Collection</h2>
						<div className="flex items-center space-x-2">
							<Badge variant="outline" className="text-sm">
								<WalletIcon className="h-3 w-3 mr-1" /> {formatAddress(walletAddress)}
							</Badge>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{userNfts.map(nft => (
							<Card
								key={nft.id}
								className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
								onClick={() => handleNftClick(nft)}
							>
								<div className="aspect-square relative">
									<img
										src={nft.image || '/placeholder.svg'}
										alt={nft.name}
										className="object-cover w-full h-full"
									/>
								</div>
								<CardContent className="p-4">
									<h3 className="font-medium truncate">{nft.name}</h3>
									<div className="flex justify-between items-center mt-2">
										<div className="flex items-center">
											<Avatar className="h-6 w-6 mr-2">
												<AvatarImage src={nft.creatorAvatar} />
												<AvatarFallback>{nft.creatorName.substring(0, 2)}</AvatarFallback>
											</Avatar>
											<span className="text-xs text-muted-foreground">{nft.creatorName}</span>
										</div>
										<Badge variant="outline" className="text-xs">
											{nft.chain}
										</Badge>
									</div>
								</CardContent>
							</Card>
						))}

						<Card
							className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-dashed"
							onClick={() => {
								const createTabTrigger = document.getElementById('create-tab-trigger')
								if (createTabTrigger) {
									createTabTrigger.click()
								}
							}}
						>
							<div className="aspect-square flex items-center justify-center">
								<div className="flex flex-col items-center text-muted-foreground">
									<Plus className="h-12 w-12 mb-2" />
									<span>Create New</span>
								</div>
							</div>
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
										onChange={e => setPrompt(e.target.value)}
									/>
								</div>

								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Info className="h-4 w-4" />
									<span>Be descriptive for better results. Include style, colors, and themes.</span>
								</div>
							</CardContent>
							<CardFooter>
								<Button onClick={handleGenerate} disabled={!prompt || isGenerating} className="w-full">
									{isGenerating ? (
										<>
											Generating
											<Sparkles className="ml-2 h-4 w-4 animate-pulse" />
										</>
									) : (
										<>
											Generate with AI
											<Sparkles className="ml-2 h-4 w-4" />
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
							<CardContent className="flex justify-center">
								<div className="flex flex-col items-center justify-center border rounded-lg p-10 w-full h-[300px]">
									{generatedImage ? (
										<img
											src={generatedImage}
											alt="Generated NFT"
											className="max-h-full object-contain"
										/>
									) : (
										<>
											<ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
											<p className="text-muted-foreground">
												{isGenerating
													? 'Generating your image...'
													: 'Your NFT will appear here'}
											</p>
										</>
									)}
								</div>
							</CardContent>
							<CardFooter>
								<Button disabled={isMinting} onClick={handleMint} className="w-full">
									{isMinting ? (
										<>Minting NFT...</>
									) : (
										<>
											Mint Test NFT <ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* NFT Detail Dialog */}
			<Dialog open={selectedNft !== null} onOpenChange={handleCloseDialog}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle className="text-2xl">{selectedNft?.name}</DialogTitle>
						<DialogDescription>Created on {selectedNft?.created}</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
						<div>
							<img
								src={selectedNft?.image || '/placeholder.svg'}
								alt={selectedNft?.name}
								className="rounded-lg w-full object-cover"
							/>
						</div>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium mb-2">Creator</h3>
								<div className="flex items-center space-x-3">
									<Avatar>
										<AvatarImage src={selectedNft?.creatorAvatar} />
										<AvatarFallback>{selectedNft?.creatorName?.substring(0, 2)}</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{selectedNft?.creatorName}</p>
										<p className="text-sm text-muted-foreground">{selectedNft?.creator}</p>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">AI Prompt</h3>
								<Card className="bg-muted">
									<CardContent className="p-4">
										<p className="text-sm italic">"{selectedNft?.prompt}"</p>
									</CardContent>
								</Card>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">Details</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Blockchain</span>
										<Badge>{selectedNft?.chain}</Badge>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Token ID</span>
										<span className="font-mono">#{selectedNft?.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Created</span>
										<span>{selectedNft?.created}</span>
									</div>
								</div>
							</div>

							<div className="pt-4">
								<Button className="w-full">
									View on Explorer <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="mt-8">
						<h3 className="text-xl font-medium mb-4">Contribution History</h3>
						<div className="space-y-6">
							{selectedNft?.history?.map((item, index) => (
								<Card
									key={item.id}
									className={index === selectedNft.history.length - 1 ? 'border-primary' : ''}
								>
									<CardContent className="p-4">
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<img
													src={item.image || '/placeholder.svg'}
													alt={`Contribution by ${item.contributor}`}
													className="rounded-lg w-full h-auto object-cover"
												/>
											</div>
											<div className="md:col-span-2 space-y-3">
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														<Avatar className="h-6 w-6">
															<AvatarImage src={item.contributorAvatar} />
															<AvatarFallback>
																{item.contributor.substring(0, 2)}
															</AvatarFallback>
														</Avatar>
														<span className="font-medium">{item.contributor}</span>
													</div>
													<span className="text-sm text-muted-foreground">{item.date}</span>
												</div>
												<div>
													<h4 className="text-sm font-medium mb-1">AI Prompt:</h4>
													<p className="text-sm text-muted-foreground italic">
														"{item.prompt}"
													</p>
												</div>
												{index === selectedNft.history.length - 1 && (
													<Badge className="mt-2">Current Version</Badge>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
