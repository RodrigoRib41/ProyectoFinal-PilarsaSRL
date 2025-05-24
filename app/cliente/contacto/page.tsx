import dynamic from "next/dynamic";
import ContactoForm from "@/components/cliente/Formulario";

const Mapa = dynamic(() => import("@/components/cliente/Mapa"), { ssr: false });

export default function ContactoPage() {
  return (
    <div className="container mx-auto p-6">
      <Mapa />
      <ContactoForm />
    </div>
  );
}
