import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CM Kerala – Chief Minister's Public Grievance Redressal Portal",
  description:
    "Official grievance submission, tracking and redressal platform directly connecting citizens of Kerala with the Chief Minister's Office.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0f172a",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
