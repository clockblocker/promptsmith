import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "~/components/layout/header";

export const metadata: Metadata = {
	title: "Promptsmith",
	description: "Local-first prompt engineering tool",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geistSans.variable} ${geistMono.variable} dark`}
			lang="en"
		>
			<body className="min-h-screen bg-background antialiased">
				<Header />
				<main>{children}</main>
			</body>
		</html>
	);
}
