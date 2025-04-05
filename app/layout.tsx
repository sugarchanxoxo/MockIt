import type { Metadata } from 'next'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './provider'

export const metadata: Metadata = {
	title: 'NekoDAO',
	description: 'Generate unique NFTs with AI, track their history on-chain, and contribute to existing creations✨',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
