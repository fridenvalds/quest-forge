import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quest Forge - RPG Habit Tracker",
  description: "Transform your daily habits into an epic RPG adventure. Level up your real life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
