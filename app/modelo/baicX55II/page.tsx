import type { Metadata } from "next";
import { BaicModelPage } from "@/components/cliente/catalog/BaicModelPage";
import { baicModelPages } from "@/lib/baic-model-pages";

const model = baicModelPages.baicX55II;

export const metadata: Metadata = {
  title: `BAIC ${model.name} | Pilarsa SRL`,
  description: model.description,
};

export default function BaicX55IIPage() {
  return <BaicModelPage model={model} />;
}
