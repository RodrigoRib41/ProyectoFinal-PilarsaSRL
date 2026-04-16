import { InventoryCatalogPage } from "@/components/cliente/catalog/InventoryCatalogPage";

export default function AutosZeroKm() {
  return (
    <InventoryCatalogPage
      module="zeroKm"
      eyebrow="0 km Pilarsa"
      title="Un espacio dedicado para las unidades nuevas disponibles."
      description="Ahora el stock 0 km tiene su propio recorrido publico para mostrar unidades nuevas sin mezclarlas con el catalogo de usados."
      detailBasePath="/0km"
      emptyMessage="No encontramos 0 km para ese filtro."
      enableModelFilter
      enableYearFilter
      forceZeroKilometers
    />
  );
}
