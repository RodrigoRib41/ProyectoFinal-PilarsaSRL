import ContactoForm from "@/components/cliente/Formulario";
import MapaWrapper from "@/components/cliente/MapaWrapper";

export default function ContactoPage() {
  return (
    <div className="container mx-auto p-6">
      <MapaWrapper />
      <ContactoForm />
    </div>
  );
}
