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

  // Excluye layout si es /admin o /auth
  const isAdminOrAuth = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");


  if (isAdminOrAuth) {
    return <>{children}</>; // Sin layout
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pt-20"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
