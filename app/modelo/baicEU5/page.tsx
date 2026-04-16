import type { Metadata } from "next";
import { BaicModelPage } from "@/components/cliente/catalog/BaicModelPage";
import { baicModelPages } from "@/lib/baic-model-pages";

const model = baicModelPages.baicEU5;

export const metadata: Metadata = {
  title: `BAIC ${model.name} | Pilarsa SRL`,
  description: model.description,
};

export default function BaicEU5Page() {
  return <BaicModelPage model={model} />;
}
