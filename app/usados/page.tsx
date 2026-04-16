import { InventoryCatalogPage } from "@/components/cliente/catalog/InventoryCatalogPage";

export default function AutosUsados() {
  return (
    <InventoryCatalogPage
      module="used"
      eyebrow="Seminuevos Pilarsa"
      title="Un catalogo mas facil de recorrer para los usados del concesionario."
      description="Separamos los usados del stock 0 km para que el cliente pueda filtrar, comparar y llegar al detalle correcto sin ruido visual."
      detailBasePath="/usados"
      emptyMessage="No encontramos usados para ese filtro."
    />
  );
}
