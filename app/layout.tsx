import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthCheck from "@/_components/auth_check.component";
import GraphqlProvider from "@/_components/graphql_provider.component";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<GraphqlProvider>
					<AuthCheck>
						{children}
						<Toaster richColors position="top-center" />
					</AuthCheck>
				</GraphqlProvider>
			</body>
		</html>
	);
}
