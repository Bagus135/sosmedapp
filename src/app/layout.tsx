import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";


export const metadata: Metadata = {
  title: "Fesbuk",
  description: "Social App use NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" sizes="any"/>
      </head>
      <body
        className={`antialiased`}
      >
        <ThemeProvider 
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
       >
        <div className="min-h-screen">
          <Navbar />
          <main className="py-8">
              <div className="mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="hidden lg:block lg:col-span-3">
                    <Sidebar/>
                  </div>
                  <div className="lg:col-span-9">
                    {children}
                </div>
              </div>
            </div>
          </main>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
