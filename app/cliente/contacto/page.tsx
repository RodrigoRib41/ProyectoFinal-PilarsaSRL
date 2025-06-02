import ContactoForm from "@/components/cliente/Formulario";
import MapaWrapper from "@/components/cliente/MapaWrapper";
import ContactoSection from "@/components/cliente/ContactSection";
import { Toaster } from "sonner";


export default function ContactoPage() {
  return (
    <div className="container mx-auto p-6">
      <MapaWrapper />
      <ContactoSection />
      <ContactoForm />
      <Toaster richColors position="top-right" />
    </div>
  );
}
