import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type AutoPurchaseMetadata = {
  autoId: number;
  createdAt: string;
};

type AutoPurchaseMetadataRecord = Record<string, AutoPurchaseMetadata>;

const metadataFilePath = path.join(
  process.cwd(),
  "data",
  "auto-purchase-metadata.json",
);

async function readMetadataFile() {
  try {
    const content = await readFile(metadataFilePath, "utf8");
    return JSON.parse(content) as AutoPurchaseMetadataRecord;
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    if (fileError.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeMetadataFile(payload: AutoPurchaseMetadataRecord) {
  await mkdir(path.dirname(metadataFilePath), { recursive: true });
  await writeFile(metadataFilePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function getAutoPurchaseMetadata(balanceIds?: number[]) {
  const metadata = await readMetadataFile();

  if (!balanceIds?.length) {
    return metadata;
  }

  return Object.fromEntries(
    balanceIds
      .map((id) => [String(id), metadata[String(id)]])
      .filter((entry): entry is [string, AutoPurchaseMetadata] => Boolean(entry[1])),
  );
}

export async function getAutoPurchaseRecord(balanceId: number) {
  const metadata = await getAutoPurchaseMetadata([balanceId]);
  return metadata[String(balanceId)] ?? null;
}

export async function linkPurchaseToAuto(balanceId: number, autoId: number) {
  const metadata = await readMetadataFile();
  metadata[String(balanceId)] = {
    autoId,
    createdAt: new Date().toISOString(),
  };
  await writeMetadataFile(metadata);
}

export async function removePurchaseToAutoLink(balanceId: number) {
  const metadata = await readMetadataFile();
  delete metadata[String(balanceId)];
  await writeMetadataFile(metadata);
}
