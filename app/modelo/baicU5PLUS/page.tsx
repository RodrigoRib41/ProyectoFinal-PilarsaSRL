import type { Metadata } from "next";
import { BaicModelPage } from "@/components/cliente/catalog/BaicModelPage";
import { baicModelPages } from "@/lib/baic-model-pages";

const model = baicModelPages.baicU5PLUS;

export const metadata: Metadata = {
  title: `BAIC ${model.name} | Pilarsa SRL`,
  description: model.description,
};

export default function BaicU5PlusPage() {
  return <BaicModelPage model={model} />;
}
