import { InventoryDetailPage } from "@/components/cliente/catalog/InventoryDetailPage";

export default function AutoZeroKmDetalle() {
  return (
    <InventoryDetailPage
      module="zeroKm"
      listingHref="/0km"
      listingLabel="Volver al catalogo 0 km"
      forceZeroKilometers
    />
  );
}
