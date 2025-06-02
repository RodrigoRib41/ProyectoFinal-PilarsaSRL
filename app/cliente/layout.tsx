
import Navbar from "@/components/cliente/Navbar";
import Footer from "@/components/cliente/Footer";
import WhatsAppButton from "@/components/cliente/WhatsappButton";

  export default function ClienteLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <Navbar />
        <main className="pt-20">{children}</main> {/* pt-16 para que no tape el contenido */}
        <Footer />
        <WhatsAppButton />
      </>
    );
  }
  
