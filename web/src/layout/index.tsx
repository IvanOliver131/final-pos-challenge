import { Toaster } from "@/components/ui/sonner";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <main className="mx-auto px-2 py-4 md:px-16">{children}</main>
      <Toaster />
    </div>
  );
}
