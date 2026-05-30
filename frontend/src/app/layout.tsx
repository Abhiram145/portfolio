import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: "DevPortfolio | Senior Full Stack Engineer",
  description: "Senior Full Stack Engineer portfolio showcasing experience, projects, and skills.",
  keywords: ["Full Stack Engineer", "Next.js", "React", "Node.js", "MongoDB", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
