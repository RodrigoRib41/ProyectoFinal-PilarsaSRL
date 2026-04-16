import { InventoryDetailPage } from "@/components/cliente/catalog/InventoryDetailPage";

export default function AutoUsadoDetalle() {
  return (
    <InventoryDetailPage
      module="used"
      listingHref="/usados"
      listingLabel="Volver al catalogo de usados"
    />
  );
}
