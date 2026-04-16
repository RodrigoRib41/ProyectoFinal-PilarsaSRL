"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/cliente/Navbar";
import Footer from "@/components/cliente/Footer";
import WhatsAppButton from "@/components/cliente/WhatsappButton";

export default function ClienteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrAuth = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="min-h-screen overflow-x-hidden pt-24 md:pt-28"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
