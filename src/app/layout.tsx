import type { Metadata } from "next";
import "./globals.css";
import BackgroundMusic from "@/components/BackgroundMusic";

export const metadata: Metadata = {
  title: "සදහම් නෞකාව වෙසක් කලාපය | Sadaham Naukawa Vesak Kalapaya",
  description: "ඩිජිටල් වෙසක් කලාපය - ඔබේ වෙසක් නිර්මාණය ලොවටම පෙන්වන්න",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si">
      <body suppressHydrationWarning className="antialiased selection:bg-[#D4AF37] selection:text-black min-h-screen flex flex-col">
        {children}
        <BackgroundMusic />
      </body>
    </html>
  );
}

