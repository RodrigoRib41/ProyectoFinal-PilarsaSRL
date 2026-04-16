import { InventoryCatalogPage } from "@/components/cliente/catalog/InventoryCatalogPage";

export default function PromocionesPage() {
  return (
    <InventoryCatalogPage
      module="all"
      eyebrow="Promociones Pilarsa"
      title="Un solo listado para ver las oportunidades activas del stock."
      description="Esta vista reune las unidades con precio promocional activo, tanto usados como 0 km, para comparar rapido y entrar al detalle correcto desde el primer clic."
      emptyMessage="No hay promociones activas en este momento."
      defaultPromosOnly
      lockPromosOnly
    />
  );
}
